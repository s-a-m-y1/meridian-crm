import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiQuery, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../common/guards/auth.guard';
import { OrganizationMemberGuard } from '../common/guards/organization-member.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CurrentOrg } from '../common/decorators/current-org.decorator';
import { FilesService } from './files.service';
import { PresignUploadDto } from './dto/presign-upload.dto';
import { ConfirmUploadDto } from './dto/confirm-upload.dto';
import { FileResponseDto } from './dto/file-response.dto';
import { FileResourceType } from './file.entity';
import { OrgContext } from '../common/decorators/org-context.interface';
import { BadRequestException } from '@nestjs/common';

@ApiTags('Files')
@Controller('files')
@UseGuards(AuthGuard, OrganizationMemberGuard, RolesGuard)
@ApiBearerAuth()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('presign')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Get presigned URL for direct-to-S3 upload' })
  async presignUpload(
    @Body() dto: PresignUploadDto,
    @CurrentOrg() orgContext: OrgContext,
    @CurrentUser() user: { id: string },
  ) {
    return this.filesService.presignUpload(dto, orgContext, user.id);
  }

  @Post('upload-local/:fileId')
  @Roles('owner', 'admin', 'manager', 'agent')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload file directly to local storage (development)' })
  async uploadLocal(
    @Param('fileId') fileId: string,
    @UploadedFile() file: any,
    @CurrentOrg() orgContext: OrgContext,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.filesService.uploadLocal(fileId, file.buffer, file.mimetype, orgContext);
  }

  @Post('confirm')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Confirm upload completion and verify file' })
  async confirmUpload(
    @Body() dto: ConfirmUploadDto,
    @CurrentOrg() orgContext: OrgContext,
  ): Promise<FileResponseDto> {
    return this.filesService.confirmUpload(dto, orgContext);
  }

  @Get()
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'List files with optional filters' })
  @ApiQuery({ name: 'resourceType', required: false, enum: FileResourceType })
  @ApiQuery({ name: 'resourceId', required: false, type: String })
  async listFiles(
    @CurrentOrg() orgContext: OrgContext,
    @Query('resourceType') resourceType?: FileResourceType,
    @Query('resourceId') resourceId?: string,
  ): Promise<FileResponseDto[]> {
    return this.filesService.listFiles(orgContext, resourceType, resourceId);
  }

  @Get(':id')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Get file by ID' })
  async getFile(
    @Param('id') id: string,
    @CurrentOrg() orgContext: OrgContext,
  ): Promise<FileResponseDto> {
    return this.filesService.getFile(id, orgContext);
  }

  @Get('serve/:id')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Serve file content' })
  async serveFile(
    @Param('id') id: string,
    @CurrentOrg() orgContext: OrgContext,
  ) {
    return this.filesService.serveFile(id, orgContext);
  }

  @Patch('reorder')
  @Roles('owner', 'admin', 'manager')
  @ApiOperation({ summary: 'Reorder files (gallery ordering)' })
  @HttpCode(HttpStatus.OK)
  async reorderFiles(
    @Body() fileIds: string[],
    @CurrentOrg() orgContext: OrgContext,
  ): Promise<void> {
    return this.filesService.reorderFiles(fileIds, orgContext);
  }

  @Delete(':id')
  @Roles('owner', 'admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete file (admin only)' })
  async deleteFile(
    @Param('id') id: string,
    @CurrentOrg() orgContext: OrgContext,
  ): Promise<void> {
    return this.filesService.deleteFile(id, orgContext);
  }
}
