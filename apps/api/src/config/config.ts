import type { LevelWithSilent } from 'pino';

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

const LOG_LEVELS: readonly LevelWithSilent[] = [
    'fatal',
    'error',
    'warn',
    'info',
    'debug',
    'trace',
    'silent',
];

const logLevel = (fallback: LevelWithSilent): LevelWithSilent => {
    const value = optional('LOG_LEVEL', fallback);

    if (!(LOG_LEVELS as readonly string[]).includes(value)) {
        throw new Error(`Invalid log level: ${value}`);
    }

    return value as LevelWithSilent;
};

export const config = {
    API_PORT: port('API_PORT', 3000),
    DB_HOST: optional('DB_HOST', 'localhost'),
    DB_PORT: port('DB_PORT'),
    DB_USER: required('DB_USER'),
    DB_PASSWORD: required('DB_PASSWORD'),
    DB_NAME: required('DB_NAME'),
    SHUTDOWN_DRAIN_DELAY_MS: numeric('SHUTDOWN_DRAIN_DELAY_MS', 0),
    SHUTDOWN_TIMEOUT_MS: numeric('SHUTDOWN_TIMEOUT_MS', 8000),
    LOG_LEVEL: logLevel('info'),
};

export type Config = typeof config;
