import { IsOptional, IsString, IsEnum, IsInt, Min, Max, MaxLength, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum PropertySortBy {
  NAME = 'name',
  CATEGORY = 'category',
  PRICE = 'price',
  BEDROOMS = 'bedrooms',
  LOCATION = 'location',
  STATUS = 'status',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PropertyQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ enum: PropertySortBy })
  @IsOptional()
  @IsEnum(PropertySortBy)
  sortBy?: PropertySortBy = PropertySortBy.CREATED_AT;

  @ApiPropertyOptional({ enum: SortOrder })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;

  @ApiPropertyOptional({ example: 'Villa' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  search?: string;

  @ApiPropertyOptional({ enum: ['AVAILABLE', 'RESERVED', 'SOLD'] })
  @IsOptional()
  @IsEnum(['AVAILABLE', 'RESERVED', 'SOLD'])
  status?: string;

  @ApiPropertyOptional({ enum: ['APARTMENT', 'VILLA', 'TOWNHOUSE', 'LAND', 'COMMERCIAL', 'OFFICE'] })
  @IsOptional()
  @IsEnum(['APARTMENT', 'VILLA', 'TOWNHOUSE', 'LAND', 'COMMERCIAL', 'OFFICE'])
  category?: string;

  @ApiPropertyOptional({ example: 5000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceMin?: number;

  @ApiPropertyOptional({ example: 10000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceMax?: number;

  @ApiPropertyOptional({ example: 'Zamalek' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  location?: string;
}