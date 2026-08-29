import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FirebaseLoginDto {
  @ApiProperty({ description: 'Firebase ID Token' })
  @IsString()
  token: string;

  @ApiProperty({ required: false, description: 'First name (from signup)' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false, description: 'Last name (from signup)' })
  @IsOptional()
  @IsString()
  lastName?: string;
}
