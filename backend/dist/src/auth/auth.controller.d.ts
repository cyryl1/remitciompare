import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { FirebaseLoginDto } from './dto/firebase-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import type { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto, res: Response): Promise<{
        accessToken: string;
        user: {
            id: any;
            email: any;
            role: any;
            emailVerified: any;
            firstName: any;
            lastName: any;
        };
    }>;
    login(loginDto: LoginDto, res: Response): Promise<{
        accessToken: string;
        user: {
            id: any;
            email: any;
            role: any;
            emailVerified: any;
            firstName: any;
            lastName: any;
        };
    }>;
    firebaseLogin(dto: FirebaseLoginDto, res: Response): Promise<{
        accessToken: string;
        user: {
            id: any;
            email: any;
            role: any;
            emailVerified: any;
            firstName: any;
            lastName: any;
        };
    }>;
    refresh(req: any, res: Response): Promise<{
        user: {
            id: any;
            email: any;
            role: any;
            emailVerified: any;
            firstName: any;
            lastName: any;
        };
    }>;
    logout(res: Response): Promise<{
        message: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<{
        message: string;
    }>;
    getProfile(req: any): any;
    private setAuthCookies;
}
