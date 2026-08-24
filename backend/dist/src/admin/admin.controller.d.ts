import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getActivity(): Promise<never[]>;
    getQuoteFailures(): Promise<never[]>;
}
