import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { FirebaseLoginDto } from './dto/firebase-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import type { Request, Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto, req: Request, res: Response): Promise<{
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
    login(loginDto: LoginDto, req: Request, res: Response): Promise<{
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
    firebaseLogin(dto: FirebaseLoginDto, req: Request, res: Response): Promise<{
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
    resetPassword(resetPasswordDto: ResetPasswordDto, req: Request): Promise<{
        message: string;
    }>;
    verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<{
        message: string;
    }>;
    getProfile(req: any): any;
    private setAuthCookies;
}
