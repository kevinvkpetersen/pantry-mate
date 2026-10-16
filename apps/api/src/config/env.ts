type AssertDisjoint<T extends never> = T;

export const REQUIRED_ENV = [
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'POSTGRES_PORT',
    'POSTGRES_DB',
] as const;
export const OPTIONAL_ENV = [
    'API_PORT',
    'POSTGRES_HOST',
    'SHUTDOWN_DRAIN_DELAY_MS',
    'SHUTDOWN_TIMEOUT_MS',
] as const;

export type RequiredEnv = (typeof REQUIRED_ENV)[number];
export type OptionalEnv = (typeof OPTIONAL_ENV)[number];
export type RequiredAndOptionalAreDisjoint = AssertDisjoint<
    RequiredEnv & OptionalEnv
>;

export type EnvKey = RequiredEnv | OptionalEnv;

export const NUMERIC_ENV = [
    'API_PORT',
    'POSTGRES_PORT',
    'SHUTDOWN_DRAIN_DELAY_MS',
    'SHUTDOWN_TIMEOUT_MS',
] as const satisfies readonly EnvKey[];
export type NumericEnv = (typeof NUMERIC_ENV)[number];

export const PORT_ENV = [
    'API_PORT',
    'POSTGRES_PORT',
] as const satisfies readonly NumericEnv[];
export type PortEnv = (typeof PORT_ENV)[number];

export const URL_ENCODED_ENV = [
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'POSTGRES_DB',
] as const satisfies readonly EnvKey[];
