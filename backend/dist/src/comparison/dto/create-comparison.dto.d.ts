import { Priority } from '../comparison.service';
export declare class CreateComparisonDto {
    sourceCurrency: string;
    targetCurrency: string;
    fromCountry?: string;
    toCountry?: string;
    sendAmount: number;
    priority?: Priority;
    paymentMethod?: string;
    deliveryPreference?: string;
    providerSlug?: string;
}
