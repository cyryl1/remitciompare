import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Priority } from '../comparison.service';

export class CreateComparisonDto {
  @ApiProperty({ example: 'GBP', description: 'Origin currency code' })
  @IsString()
  @IsNotEmpty()
  sourceCurrency: string;

  @ApiProperty({ example: 'NGN', description: 'Destination currency code' })
  @IsString()
  @IsNotEmpty()
  targetCurrency: string;

  @ApiPropertyOptional({ example: 'GB', description: 'Origin country code' })
  @IsString()
  @IsOptional()
  fromCountry?: string = 'GB'; // Default to GB for MVP

  @ApiPropertyOptional({
    example: 'NG',
    description: 'Destination country code',
  })
  @IsString()
  @IsOptional()
  toCountry?: string = 'NG'; // Default to NG for MVP

  @ApiProperty({
    example: 1000,
    description: 'Amount to send in source currency',
  })
  @IsNumber()
  @Min(1)
  sendAmount: number;

  @ApiPropertyOptional({ enum: Priority, example: Priority.MOST_RECEIVED })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority = Priority.MOST_RECEIVED;

  @ApiPropertyOptional({ example: 'BANK_TRANSFER' })
  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @ApiPropertyOptional({ example: 'FAST' })
  @IsString()
  @IsOptional()
  deliveryPreference?: string;
}
