import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getPreferences(req: any): Promise<{
        notifications: {
            email: boolean;
            push: boolean;
        };
        defaultRoute: {
            from: string;
            to: string;
        };
    }>;
    updatePreferences(req: any, body: any): Promise<any>;
}
