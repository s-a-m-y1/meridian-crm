import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateOrganizationDto {
  @ApiProperty({ example: 'Meridian Real Estate' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;
}
