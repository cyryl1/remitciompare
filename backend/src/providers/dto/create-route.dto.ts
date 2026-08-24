import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRouteDto {
  @ApiProperty({ example: 'GBP', description: 'Origin currency code (ISO 4217)' })
  @IsString()
  @IsNotEmpty()
  fromCurrency: string;

  @ApiProperty({ example: 'NGN', description: 'Destination currency code (ISO 4217)' })
  @IsString()
  @IsNotEmpty()
  toCurrency: string;

  @ApiPropertyOptional({ example: 'GB', description: 'Origin country code (ISO 3166-1 alpha-2)' })
  @IsString()
  @IsOptional()
  fromCountry?: string;

  @ApiPropertyOptional({ example: 'NG', description: 'Destination country code (ISO 3166-1 alpha-2)' })
  @IsString()
  @IsOptional()
  toCountry?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
