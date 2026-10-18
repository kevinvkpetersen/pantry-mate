type AssertDisjoint<T extends never> = T;

export const REQUIRED_ENV = [
    'DB_PORT',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
] as const;
export const OPTIONAL_ENV = [
    'API_PORT',
    'DB_HOST',
    'SHUTDOWN_DRAIN_DELAY_MS',
    'SHUTDOWN_TIMEOUT_MS',
    'LOG_LEVEL',
] as const;

export type RequiredEnv = (typeof REQUIRED_ENV)[number];
export type OptionalEnv = (typeof OPTIONAL_ENV)[number];
export type RequiredAndOptionalAreDisjoint = AssertDisjoint<
    RequiredEnv & OptionalEnv
>;

export type EnvKey = RequiredEnv | OptionalEnv;

export const NUMERIC_ENV = [
    'API_PORT',
    'DB_PORT',
    'SHUTDOWN_DRAIN_DELAY_MS',
    'SHUTDOWN_TIMEOUT_MS',
] as const satisfies readonly EnvKey[];
export type NumericEnv = (typeof NUMERIC_ENV)[number];

export const PORT_ENV = [
    'API_PORT',
    'DB_PORT',
] as const satisfies readonly NumericEnv[];
export type PortEnv = (typeof PORT_ENV)[number];
