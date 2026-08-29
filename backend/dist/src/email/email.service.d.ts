import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configService;
    private transporter;
    private readonly logger;
    constructor(configService: ConfigService);
    sendVerificationEmail(to: string, token: string): Promise<boolean>;
    sendPasswordResetEmail(to: string, token: string): Promise<boolean>;
    sendRateAlert(opts: {
        to: string;
        sendAmount: number;
        fromCurrency: string;
        toCurrency: string;
        recipientAmount: number;
        provider: string;
        targetRecipientAmount: number;
    }): Promise<boolean>;
    sendWeeklyComparisonEmail(to: string, routes: Array<{
        fromCurrency: string;
        toCurrency: string;
        sendAmount: number;
        bestProvider: string;
        bestRecipientAmount: string;
    }>): Promise<boolean>;
    sendDataArchiveEmail(to: string, userData: any): Promise<boolean>;
    private sendMail;
}
