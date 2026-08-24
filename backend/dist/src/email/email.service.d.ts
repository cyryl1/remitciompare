import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configService;
    private transporter;
    private readonly logger;
    constructor(configService: ConfigService);
    sendVerificationEmail(to: string, token: string): Promise<boolean>;
    sendPasswordResetEmail(to: string, token: string): Promise<boolean>;
    private sendMail;
}
