import type { NumericEnv, OptionalEnv, PortEnv, RequiredEnv } from './env';

const required = (name: RequiredEnv): string => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
};

const optional = (name: OptionalEnv, fallback: string): string =>
    process.env[name] || fallback;

const numeric = (name: NumericEnv, fallback?: number): number => {
    const value =
        fallback === undefined
            ? required(name as RequiredEnv)
            : optional(name as OptionalEnv, String(fallback));
    if (!/^\d+$/.test(value)) {
        throw new Error(`${name} must be a whole number, got "${value}"`);
    }
    return Number(value);
};

const port = (name: PortEnv, fallback?: number): number => {
    const value = numeric(name, fallback);
    if (value < 1 || value > 65535) {
        throw new Error(`Invalid port in ${name}: ${value}`);
    }
    return value;
};

export const config = {
    API_PORT: port('API_PORT', 3000),
    SHUTDOWN_DRAIN_DELAY_MS: numeric('SHUTDOWN_DRAIN_DELAY_MS', 0),
    SHUTDOWN_TIMEOUT_MS: numeric('SHUTDOWN_TIMEOUT_MS', 8000),
    DATABASE_URL: `postgres://${encodeURIComponent(required('POSTGRES_USER'))}:${encodeURIComponent(required('POSTGRES_PASSWORD'))}@${optional('POSTGRES_HOST', 'localhost')}:${port('POSTGRES_PORT')}/${encodeURIComponent(required('POSTGRES_DB'))}`,
};

export type Config = typeof config;
