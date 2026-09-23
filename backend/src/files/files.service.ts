import { Injectable, Logger, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { File, FileResourceType, FileStatus } from './file.entity';
import { PresignUploadDto } from './dto/presign-upload.dto';
import { ConfirmUploadDto } from './dto/confirm-upload.dto';
import { FileResponseDto } from './dto/file-response.dto';
import { OrgContext } from '../common/decorators/org-context.interface';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private s3Client: S3Client | null = null;
  private bucket: string;
  private region: string;
  private useLocalStorage: boolean = false;
  private localStoragePath: string;

  // Mime type validation
  private readonly ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  private readonly ALLOWED_DOCUMENT_TYPES = ['application/pdf'];
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

  private readonly MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly MAX_DOCUMENT_SIZE = 25 * 1024 * 1024; // 25MB

  constructor(
    @InjectRepository(File)
    private readonly fileRepo: Repository<File>,
    private readonly configService: ConfigService,
  ) {
    this.region = this.configService.get<string>('S3_REGION') || 'us-east-1';
    this.bucket = this.configService.get<string>('S3_BUCKET') || 'crm-files';
    this.localStoragePath = this.configService.get<string>('LOCAL_STORAGE_PATH') || '/tmp/crm-uploads';
    
    // Check if we should use local storage
    const endpoint = this.configService.get<string>('S3_ENDPOINT');
    const accessKey = this.configService.get<string>('S3_ACCESS_KEY');
    const secretKey = this.configService.get<string>('S3_SECRET_KEY');
    
    // Force local storage if no S3 endpoint or if using localstack/localhost
    const isLocalEndpoint = endpoint && (endpoint.includes('localstack') || endpoint.includes('localhost') || endpoint.includes('127.0.0.1'));
    
    if (endpoint && accessKey && secretKey && !isLocalEndpoint) {
      try {
        this.s3Client = new S3Client({
          region: this.configService.get<string>('S3_REGION') || 'us-east-1',
          endpoint: endpoint,
          credentials: {
            accessKeyId: accessKey,
            secretAccessKey: secretKey,
          },
          forcePathStyle: this.configService.get<string>('S3_FORCE_PATH_STYLE') === 'true',
        });
        this.logger.log('S3 client initialized');
      } catch (error) {
        this.logger.warn('Failed to initialize S3 client, falling back to local storage', error);
        this.useLocalStorage = true;
      }
    } else {
      this.logger.warn('S3 not configured or using local endpoint, using local storage');
      this.useLocalStorage = true;
    }

    // Ensure local storage directory exists
    if (this.useLocalStorage) {
      if (!fs.existsSync(this.localStoragePath)) {
        fs.mkdirSync(this.localStoragePath, { recursive: true });
      }
      this.logger.log(`Using local storage at ${this.localStoragePath}`);
    }
  }

  private getMaxSize(mimeType: string): number {
    return ['image/jpeg', 'image/png', 'image/webp'].includes(mimeType) 
      ? 10 * 1024 * 1024 
      : 25 * 1024 * 1024;
  }

  private validateMimeType(mimeType: string): void {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowed.includes(mimeType)) {
      throw new BadRequestException(`Mime type ${mimeType} not allowed. Allowed: ${allowed.join(', ')}`);
    }
  }

  private validateFileSize(mimeType: string, sizeBytes: number): void {
    const maxSize = this.getMaxSize(mimeType);
    if (sizeBytes > maxSize) {
      const maxMB = Math.round(maxSize / (1024 * 1024));
      throw new BadRequestException(`File size exceeds maximum allowed ${maxMB}MB for ${mimeType}`);
    }
  }

  private generateStorageKey(orgId: string, resourceType: FileResourceType, resourceId: string | null, filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const uuid = uuidv4();
    const date = new Date().toISOString().split('T')[0];
    const resourcePath = resourceId ? `${resourceType.toLowerCase()}/${resourceId}` : 'general';
    return `orgs/${orgId}/${resourcePath}/${date}/${uuid}.${ext}`;
  }

  async presignUpload(dto: PresignUploadDto, orgContext: OrgContext, uploadedBy: string): Promise<{ uploadUrl: string; fileId: string; key: string }> {
    this.validateMimeType(dto.mimeType);

    if (dto.resourceId) {
      await this.validateResourceAccess(orgContext, dto.resourceType, dto.resourceId);
    }

    const fileId = uuidv4();
    const storageKey = this.generateStorageKey(orgContext.organizationId, dto.resourceType, dto.resourceId || null, dto.filename);

    const file = this.fileRepo.create({
      id: fileId,
      organizationId: orgContext.organizationId,
      uploadedBy,
      resourceType: dto.resourceType,
      resourceId: dto.resourceId || null,
      originalName: dto.filename,
      mimeType: dto.mimeType,
      sizeBytes: 0,
      storageKey,
      status: FileStatus.PENDING,
      displayOrder: dto.displayOrder || 0,
    });

    await this.fileRepo.save(file);

    if (this.useLocalStorage || !this.s3Client) {
      // Return a local upload endpoint
      const uploadUrl = `/api/v1/files/upload-local/${fileId}`;
      return { uploadUrl, fileId, key: storageKey };
    }

    // S3 presigned URL
    const { PutObjectCommand } = await import('@aws-sdk/client-s3');
    const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: storageKey,
      ContentType: dto.mimeType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client!, command, { expiresIn: 3600 });
    return { uploadUrl, fileId, key: storageKey };
  }

  async uploadLocal(fileId: string, fileBuffer: Buffer, mimeType: string, orgContext: OrgContext): Promise<FileResponseDto> {
    const file = await this.fileRepo.findOne({
      where: { id: fileId, organizationId: orgContext.organizationId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    if (file.status !== FileStatus.PENDING) {
      throw new BadRequestException('File is not in pending state');
    }

    // Save to local storage
    const fullPath = path.join(this.localStoragePath, file.storageKey);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(fullPath, fileBuffer);

    file.sizeBytes = fileBuffer.length;
    file.status = FileStatus.READY;
    file.url = `/api/v1/files/serve/${file.id}`;
    
    await this.fileRepo.save(file);
    return this.toResponseDto(file);
  }

  async confirmUpload(dto: ConfirmUploadDto, orgContext: OrgContext): Promise<FileResponseDto> {
    const file = await this.fileRepo.findOne({
      where: { id: dto.fileId, organizationId: orgContext.organizationId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    if (file.status !== FileStatus.PENDING) {
      throw new BadRequestException('File is not in pending state');
    }

    if (this.useLocalStorage) {
      // For local storage, the file should have been uploaded via the local endpoint
      const fullPath = path.join(this.localStoragePath, file.storageKey);
      if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        file.sizeBytes = stats.size;
        file.status = FileStatus.READY;
        file.url = `/api/v1/files/serve/${file.id}`;
      } else {
        file.status = FileStatus.FAILED;
        file.errorMessage = 'File not found in local storage';
      }
    } else if (this.s3Client) {
      // Verify in S3
      try {
        const { HeadObjectCommand } = await import('@aws-sdk/client-s3');
        const headCommand = new HeadObjectCommand({
          Bucket: this.bucket,
          Key: file.storageKey,
        });
        const headResult = await this.s3Client.send(headCommand);
        file.sizeBytes = Number(headResult.ContentLength);
        file.status = FileStatus.READY;
        file.url = this.getPublicUrl(file.storageKey);
      } catch (error) {
        file.status = FileStatus.FAILED;
        file.errorMessage = error instanceof Error ? error.message : 'S3 verification failed';
        this.logger.error('S3 verification failed', error);
      }
    }

    await this.fileRepo.save(file);
    return this.toResponseDto(file);
  }

  private getPublicUrl(key: string): string {
    const endpoint = this.configService.get<string>('S3_PUBLIC_ENDPOINT');
    if (endpoint) {
      return `${endpoint}/${this.bucket}/${key}`;
    }
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }

  async getFile(id: string, orgContext: OrgContext): Promise<FileResponseDto> {
    const file = await this.fileRepo.findOne({
      where: { id, organizationId: orgContext.organizationId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return this.toResponseDto(file);
  }

  async listFiles(orgContext: OrgContext, resourceType?: FileResourceType, resourceId?: string): Promise<FileResponseDto[]> {
    const qb = this.fileRepo.createQueryBuilder('file')
      .where('file.organizationId = :orgId', { orgId: orgContext.organizationId });

    if (resourceType) {
      qb.andWhere('file.resourceType = :resourceType', { resourceType });
    }
    if (resourceId) {
      qb.andWhere('file.resourceId = :resourceId', { resourceId });
    }

    qb.andWhere('file.status = :status', { status: FileStatus.READY })
      .orderBy('file.displayOrder', 'ASC')
      .addOrderBy('file.createdAt', 'DESC');

    const files = await qb.getMany();
    return files.map(f => this.toResponseDto(f));
  }

  async serveFile(id: string, orgContext: OrgContext): Promise<{ buffer: Buffer; mimeType: string; filename: string }> {
    const file = await this.fileRepo.findOne({
      where: { id, organizationId: orgContext.organizationId },
    });

    if (!file || file.status !== FileStatus.READY) {
      throw new NotFoundException('File not found or not ready');
    }

    if (this.useLocalStorage) {
      const fullPath = path.join(this.localStoragePath, file.storageKey);
      if (!fs.existsSync(fullPath)) {
        throw new NotFoundException('File not found in storage');
      }
      const buffer = fs.readFileSync(fullPath);
      return { buffer, mimeType: file.mimeType, filename: file.originalName };
    }

    if (this.s3Client) {
      const { GetObjectCommand } = await import('@aws-sdk/client-s3');
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: file.storageKey,
      });
      const result = await this.s3Client.send(command);
      const chunks: Buffer[] = [];
      for await (const chunk of result.Body as any) {
        chunks.push(chunk);
      }
      return { buffer: Buffer.concat(chunks), mimeType: file.mimeType, filename: file.originalName };
    }

    throw new NotFoundException('File storage not configured');
  }

  async deleteFile(id: string, orgContext: OrgContext): Promise<void> {
    const file = await this.fileRepo.findOne({
      where: { id, organizationId: orgContext.organizationId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    if (this.useLocalStorage) {
      const fullPath = path.join(this.localStoragePath, file.storageKey);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } else if (this.s3Client) {
      const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
      try {
        await this.s3Client.send(new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: file.storageKey,
        }));
      } catch (error) {
        this.logger.error('S3 delete failed', error);
      }
    }

    file.status = FileStatus.DELETED;
    await this.fileRepo.save(file);
  }

  async reorderFiles(fileIds: string[], orgContext: OrgContext): Promise<void> {
    for (let i = 0; i < fileIds.length; i++) {
      await this.fileRepo.update(
        { id: fileIds[i], organizationId: orgContext.organizationId },
        { displayOrder: i },
      );
    }
  }

  private async validateResourceAccess(orgContext: OrgContext, resourceType: FileResourceType, resourceId: string): Promise<void> {
    // Placeholder - implement actual resource access validation
    return;
  }

  private toResponseDto(file: File): FileResponseDto {
    const dto = new FileResponseDto();
    Object.assign(dto, file);
    return dto;
  }
}
