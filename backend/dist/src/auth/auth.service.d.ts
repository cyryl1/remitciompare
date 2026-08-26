import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EmailService } from '../email/email.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    private emailService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService, emailService: EmailService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            email: any;
            role: any;
            emailVerified: any;
            firstName: any;
            lastName: any;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            email: any;
            role: any;
            emailVerified: any;
            firstName: any;
            lastName: any;
        };
    }>;
    refreshTokens(userId: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            email: any;
            role: any;
            emailVerified: any;
            firstName: any;
            lastName: any;
        };
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    private generateTokens;
}
