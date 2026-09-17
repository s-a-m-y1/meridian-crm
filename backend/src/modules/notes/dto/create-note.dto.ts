import { IsString, IsUUID, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteDto {
  @ApiProperty({ example: 'lead-uuid' })
  @IsUUID()
  leadId: string;

  @ApiProperty({ example: 'Lead is interested in 3BR villas in Zamalek' })
  @IsString()
  @Length(1, 5000)
  content: string;
}