declare enum Environment {
    Development = "development",
    Production = "production",
    Test = "test"
}
declare class EnvironmentVariables {
    NODE_ENV: Environment;
    DATABASE_URL: string;
    PORT: number;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRES_IN: string;
    REDIS_HOST: string;
    REDIS_PORT: number;
    FRONTEND_URL: string;
    QUOTE_CACHE_TTL_SECONDS: number;
    COMPARISON_STALE_HOURS: number;
    RATE_SNAPSHOT_AMOUNT: number;
    WISE_API_URL?: string;
    WISE_API_KEY?: string;
    SMTP_HOST?: string;
    SMTP_PORT?: number;
    SMTP_USER?: string;
    SMTP_PASS?: string;
    EMAIL_FROM?: string;
}
export declare function validate(config: Record<string, unknown>): EnvironmentVariables;
export {};
