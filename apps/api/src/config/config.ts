import type { OptionalEnv, RequiredEnv } from './env';

const required = (name: RequiredEnv): string => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
};

const optional = (name: OptionalEnv, fallback: string): string =>
    process.env[name] || fallback;

export const config = {
    API_PORT: Number(optional('API_PORT', '3000')),
    DATABASE_URL: `postgres://${required('POSTGRES_USER')}:${required('POSTGRES_PASSWORD')}@${optional('POSTGRES_HOST', 'localhost')}:${required('POSTGRES_PORT')}/${required('POSTGRES_DB')}`,
};

export type Config = typeof config;
