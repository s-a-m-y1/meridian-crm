import { IsString, IsOptional, IsEnum, IsNumber, IsUUID, Min, Max, Length, MaxLength, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LeadStatus, LeadSource } from '../lead.entity';

export class CreateLeadDto {
  @ApiProperty({ example: 'NEW', enum: LeadStatus })
  @IsOptional()
  @IsEnum(LeadStatus)
  status?: string = 'NEW';

  @ApiPropertyOptional({ enum: LeadSource })
  @IsOptional()
  @IsEnum(LeadSource)
  source?: LeadSource;

  @ApiPropertyOptional({ example: 'cust-uuid' })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiPropertyOptional({ example: 500000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  budgetMin?: number;

  @ApiPropertyOptional({ example: 1000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  budgetMax?: number;

  @ApiPropertyOptional({ example: 'APARTMENT' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  requestedPropertyType?: string;

  @ApiPropertyOptional({ example: 'Cairo, Egypt' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  requestedLocation?: string;
}