import { IsString, IsOptional, IsEnum, IsUUID, MaxLength, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FileResourceType } from '../file.entity';

export class PresignUploadDto {
  @ApiProperty({ example: 'property_photo.jpg' })
  @IsString()
  @MaxLength(255)
  filename: string;

  @ApiProperty({ example: 'image/jpeg', enum: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'] })
  @IsString()
  mimeType: string;

  @ApiPropertyOptional({ example: 5242880, description: 'Max 10MB for images, 25MB for documents' })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxSizeBytes?: number;

  @ApiProperty({ example: 'PROPERTY_IMAGE', enum: FileResourceType })
  @IsEnum(FileResourceType)
  resourceType: FileResourceType;

  @ApiPropertyOptional({ example: '11111111-1111-1111-1111-111111111114' })
  @IsOptional()
  @IsUUID()
  resourceId?: string;

  @ApiPropertyOptional({ example: 0, description: 'Display order for gallery ordering' })
  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;
}
