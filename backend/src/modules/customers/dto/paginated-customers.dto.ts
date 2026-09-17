import { ApiProperty } from '@nestjs/swagger';
import { Customer } from '../customer.entity';

export class PaginatedCustomersDto {
  @ApiProperty({ type: [Customer] })
  data: Customer[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}