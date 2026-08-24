import { ComparisonService, Priority } from './comparison.service';
export declare class ComparisonController {
    private readonly comparisonService;
    constructor(comparisonService: ComparisonService);
    getComparison(amount: string, source?: string, target?: string, priority?: Priority): Promise<import("./comparison.service").ComparisonResult>;
}
