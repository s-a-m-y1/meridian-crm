import { ApiProperty } from '@nestjs/swagger';
import { Task } from '../task.entity';

export class PaginatedTasksDto {
  @ApiProperty({ type: [Task] })
  data: Task[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}