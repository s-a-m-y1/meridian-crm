import { ApiProperty } from '@nestjs/swagger';
import { Note } from '../note.entity';

export class PaginatedNotesDto {
  @ApiProperty({ type: [Note] })
  data: Note[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}