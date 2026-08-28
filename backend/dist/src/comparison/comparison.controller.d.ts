import { ComparisonService } from './comparison.service';
import type { Request, Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
export declare class ComparisonController {
    private readonly comparisonService;
    private readonly prisma;
    constructor(comparisonService: ComparisonService, prisma: PrismaService);
    getHistory(req: Request, page?: string, limit?: string): Promise<{
        data: {
            id: string;
            sendAmount: number;
            sendCurrency: string;
            receiveCurrency: string;
            createdAt: string;
            bestProviderName: string;
            bestReceiveAmount: number;
            results: {
                providerId: string;
                providerName: string;
                providerSlug: string;
                exchangeRate: number;
                fee: number;
                receiveAmount: number;
                deliveryTime: string;
                badge: string | null;
            }[];
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    getComparisonById(id: string): Promise<{
        id: string;
        sendAmount: number;
        sendCurrency: string;
        receiveCurrency: string;
        createdAt: string;
        results: {
            providerId: string;
            providerName: string;
            providerSlug: string;
            exchangeRate: number;
            fee: number;
            receiveAmount: number;
            deliveryTime: string;
            badge: string | null;
        }[];
    } | null>;
    saveComparison(payload: any, req: Request, res: Response): Promise<{
        id: string;
        sendAmount: number;
        sendCurrency: string;
        receiveCurrency: string;
        createdAt: string;
        results: any;
    }>;
}
