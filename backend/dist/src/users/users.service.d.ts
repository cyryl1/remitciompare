import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getPreferences(userId: string): Promise<{
        notifications: {
            email: boolean;
            push: boolean;
        };
        defaultRoute: {
            from: string;
            to: string;
        };
    }>;
    updatePreferences(userId: string, data: any): Promise<any>;
}
