import { ProviderStatus } from '@prisma/client';
export declare class CreateProviderDto {
    slug: string;
    name: string;
    logoUrl?: string;
    description?: string;
    about?: string;
    tagline?: string;
    websiteUrl: string;
    affiliateUrl?: string;
    trustpilotRating?: number;
    trustpilotCount?: number;
    regulatoryInfo?: string;
    countriesSupported?: number;
    currenciesSupported?: number;
    paymentMethods?: string[];
    payoutMethods?: string[];
    deliveryMethods?: string[];
    features?: string[];
    status?: ProviderStatus;
    isActive?: boolean;
}
