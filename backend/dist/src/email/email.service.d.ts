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
    private sendMail;
}
