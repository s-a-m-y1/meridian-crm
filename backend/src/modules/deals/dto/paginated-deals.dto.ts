import { ApiProperty } from '@nestjs/swagger';
import { Deal } from '../deal.entity';

export class PaginatedDealsDto {
  @ApiProperty({ type: [Deal] })
  data: Deal[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}