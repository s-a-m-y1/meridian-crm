import { IsString, IsOptional, IsNumber, IsInt, Min, Max, Length, MaxLength, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum PropertyStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  SOLD = 'SOLD',
}

export enum PropertyCategory {
  APARTMENT = 'APARTMENT',
  VILLA = 'VILLA',
  TOWNHOUSE = 'TOWNHOUSE',
  LAND = 'LAND',
  COMMERCIAL = 'COMMERCIAL',
  OFFICE = 'OFFICE',
}

export class CreatePropertyDto {
  @ApiProperty({ example: 'Luxury Villa in Zamalek' })
  @IsString()
  @Length(1, 120)
  name: string;

  @ApiPropertyOptional({ example: 'Spacious 4BR villa with garden and pool' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: ['APARTMENT', 'VILLA', 'TOWNHOUSE', 'LAND', 'COMMERCIAL', 'OFFICE'] })
  @IsOptional()
  @IsEnum(['APARTMENT', 'VILLA', 'TOWNHOUSE', 'LAND', 'COMMERCIAL', 'OFFICE'])
  category?: string = 'APARTMENT';

  @ApiPropertyOptional({ example: 5000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 4 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(20)
  bedrooms?: number;

  @ApiPropertyOptional({ example: 'Zamalek, Cairo' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  location?: string;

  @ApiPropertyOptional({ enum: ['AVAILABLE', 'RESERVED', 'SOLD'] })
  @IsOptional()
  @IsEnum(['AVAILABLE', 'RESERVED', 'SOLD'])
  status?: string = 'AVAILABLE';
}