import { ApiProperty } from '@nestjs/swagger';
import { Activity } from '../activity.entity';

export class PaginatedActivitiesDto {
  @ApiProperty({ type: [Activity] })
  data: Activity[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}