import { ApiProperty } from '@nestjs/swagger';
import { FileStatus, FileResourceType } from '../file.entity';

export class FileResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  organizationId: string;

  @ApiProperty()
  uploadedBy: string;

  @ApiProperty({ enum: FileResourceType })
  resourceType: FileResourceType;

  @ApiProperty()
  resourceId: string | null;

  @ApiProperty()
  originalName: string;

  @ApiProperty()
  mimeType: string;

  @ApiProperty()
  sizeBytes: number;

  @ApiProperty()
  storageKey: string;

  @ApiProperty()
  url: string | null;

  @ApiProperty()
  thumbnailUrl: string | null;

  @ApiProperty()
  displayOrder: number;

  @ApiProperty({ enum: FileStatus })
  status: FileStatus;

  @ApiProperty()
  errorMessage: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
