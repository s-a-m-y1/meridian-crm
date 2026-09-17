import { ApiProperty } from '@nestjs/swagger';
import { Lead } from '../lead.entity';

export class PaginatedLeadsDto {
  @ApiProperty({ type: [Lead] })
  data: Lead[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}