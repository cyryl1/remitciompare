import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getPreferences(req: any): Promise<{
        id: string;
        email: string;
        fullName: string | null;
        countryOfResidence: string | null;
        defaultRoute: string | null;
        notificationSettings: {
            id: string;
            updatedAt: Date;
            userId: string;
            emailAlerts: boolean;
            comparisonNotifications: boolean;
            marketingEmails: boolean;
        } | null;
    } | null>;
    updatePreferences(req: any, body: any): Promise<{
        id: string;
        updatedAt: Date;
        userId: string;
        emailAlerts: boolean;
        comparisonNotifications: boolean;
        marketingEmails: boolean;
    }>;
}
