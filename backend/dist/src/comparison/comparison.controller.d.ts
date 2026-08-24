import { ComparisonService } from './comparison.service';
import { CreateComparisonDto } from './dto/create-comparison.dto';
import type { Request, Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
export declare class ComparisonController {
    private readonly comparisonService;
    private readonly prisma;
    constructor(comparisonService: ComparisonService, prisma: PrismaService);
    getComparison(dto: CreateComparisonDto, req: Request, res: Response): Promise<import("./comparison.service").ComparisonResult>;
    getHistory(req: Request): Promise<({
        quotes: {
            status: import("@prisma/client").$Enums.QuoteStatus;
            provider: string;
            exchangeRate: number;
            grossRecipientAmount: number;
            totalFees: number;
            recipientAmount: number;
            deliveryEstimate: string;
            paymentMethod: string;
            expiresAt: Date | null;
            fees: import("@prisma/client/runtime/client").JsonValue;
            quoteTimestamp: Date;
            id: string;
            deliveryMinutes: number | null;
            ranking: number | null;
            isBestValue: boolean;
            errorType: string | null;
            comparisonId: string;
        }[];
    } & {
        sendAmount: number;
        paymentMethod: string | null;
        fromCurrency: string;
        toCurrency: string;
        fromCountry: string;
        toCountry: string;
        id: string;
        createdAt: Date;
        priority: import("@prisma/client").$Enums.Priority;
        deliveryPreference: string | null;
        anonymousSessionId: string | null;
        staleAt: Date;
        userId: string | null;
    })[]>;
}
