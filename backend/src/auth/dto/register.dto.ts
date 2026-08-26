import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securepassword123', minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  password: string;

  @ApiProperty({ example: 'John', required: true })
  @IsString()
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ example: 'Doe', required: true })
  @IsString()
  @MaxLength(50)
  lastName: string;
}
