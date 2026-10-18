import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { Config } from './config';
import {
    type EnvKey,
    NUMERIC_ENV,
    OPTIONAL_ENV,
    type OptionalEnv,
    PORT_ENV,
    REQUIRED_ENV,
} from './env';

// config.ts reads process.env when it's imported, so every test needs a fresh import.
const loadConfig = async () => {
    vi.resetModules();
    const { config } = await import('./config.js');
    return config;
};

const testValues: Record<EnvKey, string> = {
    API_PORT: '4321',
    DB_HOST: 'test.host',
    DB_PORT: '5433',
    DB_USER: 'testuser',
    DB_PASSWORD: 'testpass',
    DB_NAME: 'testdb',
    SHUTDOWN_DRAIN_DELAY_MS: '1500',
    SHUTDOWN_TIMEOUT_MS: '5000',
    LOG_LEVEL: 'warn',
};

const expectedValues = {
    API_PORT: 4321,
    DB_HOST: 'test.host',
    DB_PORT: 5433,
    DB_USER: 'testuser',
    DB_PASSWORD: 'testpass',
    DB_NAME: 'testdb',
    SHUTDOWN_DRAIN_DELAY_MS: 1500,
    SHUTDOWN_TIMEOUT_MS: 5000,
    LOG_LEVEL: 'warn',
};

// What config should become when each optional variable is unset.
const defaultsWhenMissing: Record<OptionalEnv, Partial<Config>> = {
    API_PORT: { API_PORT: 3000 },
    DB_HOST: { DB_HOST: 'localhost' },
    SHUTDOWN_DRAIN_DELAY_MS: { SHUTDOWN_DRAIN_DELAY_MS: 0 },
    SHUTDOWN_TIMEOUT_MS: { SHUTDOWN_TIMEOUT_MS: 8000 },
    LOG_LEVEL: { LOG_LEVEL: 'info' },
};

describe('Config', () => {
    beforeEach(() => {
        for (const [name, value] of Object.entries(testValues)) {
            vi.stubEnv(name, value);
        }
    });

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('should populate with values from the env', async () => {
        const config = await loadConfig();

        expect(config).toEqual(expectedValues);
    });

    it.each(REQUIRED_ENV)(
        'should throw an error when %s is missing',
        async (name) => {
            vi.stubEnv(name, '');

            await expect(loadConfig()).rejects.toThrow(
                `Missing required environment variable: ${name}`
            );
        }
    );

    it.each(OPTIONAL_ENV)(
        'should use the default when optional %s is missing',
        async (name) => {
            vi.stubEnv(name, undefined);

            const config = await loadConfig();

            expect(config).toEqual({
                ...expectedValues,
                ...defaultsWhenMissing[name],
            });
        }
    );

    it.each(OPTIONAL_ENV)(
        'should use the default when optional %s is empty',
        async (name) => {
            vi.stubEnv(name, '');

            const config = await loadConfig();

            expect(config).toEqual({
                ...expectedValues,
                ...defaultsWhenMissing[name],
            });
        }
    );

    describe.each(NUMERIC_ENV)('%s number validation', (name) => {
        const nonWholeNumbers = ['abc', '3000abc', '-1', '1.5', ' '];
        it.each(nonWholeNumbers)(
            `${name} should throw for %j`,
            async (value) => {
                vi.stubEnv(name, value);

                await expect(loadConfig()).rejects.toThrow(
                    `${name} must be a whole number`
                );
            }
        );
    });

    it.each(['SHUTDOWN_DRAIN_DELAY_MS', 'SHUTDOWN_TIMEOUT_MS'] as const)(
        'should accept 0 for %s, which turns it off',
        async (name) => {
            vi.stubEnv(name, '0');

            const config = await loadConfig();

            expect(config[name]).toBe(0);
        }
    );

    describe.each(PORT_ENV)('%s port validation', (name) => {
        const outOfRangePorts = ['0', '65536'];
        it.each(outOfRangePorts)(
            `${name} should throw for %j`,
            async (value) => {
                vi.stubEnv(name, value);

                await expect(loadConfig()).rejects.toThrow(
                    `Invalid port in ${name}`
                );
            }
        );
    });

    const invalidLogLevels = ['verbose', 'none'];
    it.each(invalidLogLevels)(
        'should throw for invalid log level %j',
        async (value) => {
            vi.stubEnv('LOG_LEVEL', value);

            await expect(loadConfig()).rejects.toThrow(
                `Invalid log level: ${value}`
            );
        }
    );
});
