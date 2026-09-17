import { IsString, IsOptional, IsEnum, IsUUID, Length, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class CreateTaskDto {
  @ApiProperty({ example: 'Call lead about property viewing' })
  @IsString()
  @Length(1, 200)
  title: string;

  @ApiPropertyOptional({ example: 'Follow up on the property viewing scheduled for tomorrow' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'lead-uuid' })
  @IsOptional()
  @IsUUID()
  leadId?: string;

  @ApiPropertyOptional({ example: '2026-09-20T10:00:00Z' })
  @IsOptional()
  @Type(() => Date)
  dueAt?: Date;

  @ApiPropertyOptional({ enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] })
  @IsOptional()
  @IsEnum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
  status?: string = 'PENDING';
}