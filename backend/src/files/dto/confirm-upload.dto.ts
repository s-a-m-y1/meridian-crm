import { IsString, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ConfirmUploadDto {
  @ApiProperty({ example: 'file-uuid-from-presign' })
  @IsString()
  @IsUUID()
  fileId: string;
}
