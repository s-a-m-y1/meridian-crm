import { IsString, IsOptional, Length, IsPhoneNumber, IsEmail, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Ahmed Hassan', maxLength: 120 })
  @IsString()
  @Length(1, 120)
  name: string;

  @ApiPropertyOptional({ example: '+201012345678' })
  @IsOptional()
  @IsPhoneNumber('EG')
  phone?: string;

  @ApiPropertyOptional({ example: 'ahmed@example.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;
}