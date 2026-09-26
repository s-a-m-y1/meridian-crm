import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'Ahmed Hassan', maxLength: 120 })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;
}
