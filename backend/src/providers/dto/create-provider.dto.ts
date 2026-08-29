import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  IsEnum,
  IsBoolean,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProviderStatus } from '@prisma/client';

export class CreateProviderDto {
  @ApiProperty({ example: 'wise', description: 'Unique slug for the provider' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Wise', description: 'Display name of the provider' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'https://logo.com/wise.png' })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional({ example: 'Fast and cheap international transfers.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 'Wise (formerly TransferWise) is a global technology company...',
  })
  @IsString()
  @IsOptional()
  about?: string;

  @ApiPropertyOptional({ example: 'Money without borders' })
  @IsString()
  @IsOptional()
  tagline?: string;

  @ApiProperty({ example: 'https://wise.com' })
  @IsUrl()
  @IsNotEmpty()
  websiteUrl: string;

  @ApiPropertyOptional({ example: 'https://wise.com/?affiliate=123' })
  @IsUrl()
  @IsOptional()
  affiliateUrl?: string;

  @ApiPropertyOptional({ example: 4.8 })
  @IsNumber()
  @IsOptional()
  trustpilotRating?: number;

  @ApiPropertyOptional({ example: 150000 })
  @IsNumber()
  @IsOptional()
  trustpilotCount?: number;

  @ApiPropertyOptional({ example: 'FCA Regulated' })
  @IsString()
  @IsOptional()
  regulatoryInfo?: string;

  @ApiPropertyOptional({ example: 80 })
  @IsNumber()
  @IsOptional()
  countriesSupported?: number;

  @ApiPropertyOptional({ example: 50 })
  @IsNumber()
  @IsOptional()
  currenciesSupported?: number;

  @ApiPropertyOptional({
    type: [String],
    example: ['BANK_TRANSFER', 'DEBIT_CARD'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  paymentMethods?: string[];

  @ApiPropertyOptional({ type: [String], example: ['BANK_ACCOUNT'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  payoutMethods?: string[];

  @ApiPropertyOptional({
    type: [String],
    example: ['Minutes', 'Within 2 hours'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  deliveryMethods?: string[];

  @ApiPropertyOptional({
    type: [String],
    example: ['MOBILE_APP', 'RATE_NOTIFICATIONS'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];

  @ApiPropertyOptional({
    enum: ProviderStatus,
    example: ProviderStatus.PENDING,
  })
  @IsEnum(ProviderStatus)
  @IsOptional()
  status?: ProviderStatus;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
