import { IsString, IsEnum, IsUUID, Length, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ActivityType {
  CALL = 'CALL',
  EMAIL = 'EMAIL',
  VIEWING = 'VIEWING',
  NOTE = 'NOTE',
  WHATSAPP = 'WHATSAPP',
}

export class CreateActivityDto {
  @ApiProperty({ example: 'lead-uuid' })
  @IsUUID()
  leadId: string;

  @ApiProperty({ enum: ['CALL', 'EMAIL', 'VIEWING', 'NOTE', 'WHATSAPP'] })
  @IsEnum(['CALL', 'EMAIL', 'VIEWING', 'NOTE', 'WHATSAPP'])
  type: string;

  @ApiProperty({ example: 'Called lead to discuss property options' })
  @IsString()
  @Length(1, 5000)
  content: string;
}