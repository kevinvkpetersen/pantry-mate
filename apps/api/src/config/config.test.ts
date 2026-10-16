import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { Config } from './config';
import {
    type EnvKey,
    NUMERIC_ENV,
    type OptionalEnv,
    PORT_ENV,
    REQUIRED_ENV,
    URL_ENCODED_ENV,
} from './env';

// config.ts reads process.env when it's imported, so every test needs a fresh import.
const loadConfig = async () => {
    vi.resetModules();
    const { config } = await import('./config.js');
    return config;
};

const testValues: Record<EnvKey, string> = {
    POSTGRES_USER: 'testuser',
    POSTGRES_PASSWORD: 'testpass',
    POSTGRES_HOST: 'test.host',
    POSTGRES_PORT: '5433',
    POSTGRES_DB: 'testdb',
    API_PORT: '4321',
    SHUTDOWN_DRAIN_DELAY_MS: '1500',
    SHUTDOWN_TIMEOUT_MS: '5000',
    LOG_LEVEL: 'warn',
};

const expectedValues = {
    API_PORT: 4321,
    SHUTDOWN_DRAIN_DELAY_MS: 1500,
    SHUTDOWN_TIMEOUT_MS: 5000,
    DATABASE_URL: `postgres://${testValues.POSTGRES_USER}:${testValues.POSTGRES_PASSWORD}@${testValues.POSTGRES_HOST}:${testValues.POSTGRES_PORT}/${testValues.POSTGRES_DB}`,
    LOG_LEVEL: 'warn',
};

// What config should become when each optional variable is unset.
const defaultsWhenMissing: Record<OptionalEnv, Partial<Config>> = {
    API_PORT: { API_PORT: 3000 },
    POSTGRES_HOST: {
        DATABASE_URL: `postgres://${testValues.POSTGRES_USER}:${testValues.POSTGRES_PASSWORD}@localhost:${testValues.POSTGRES_PORT}/${testValues.POSTGRES_DB}`,
    },
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

    it.each(Object.entries(defaultsWhenMissing))(
        'should use the default when optional %s is missing',
        async (name, expected) => {
            vi.stubEnv(name, undefined);

            const config = await loadConfig();

            expect(config).toEqual({ ...expectedValues, ...expected });
        }
    );

    it.each(Object.entries(defaultsWhenMissing))(
        'should use the default when optional %s is empty',
        async (name, expected) => {
            vi.stubEnv(name, '');

            const config = await loadConfig();

            expect(config).toEqual({ ...expectedValues, ...expected });
        }
    );

    it.each(URL_ENCODED_ENV)(
        'should URL-encode %s so the connection string stays parseable',
        async (name) => {
            const badUrlValue = 'p@ss:w/rd#?%&= +é';
            const expected: Record<EnvKey, string> = {
                ...testValues,
                [name]: badUrlValue,
            };
            vi.stubEnv(name, badUrlValue);

            const config = await loadConfig();
            const url = new URL(config.DATABASE_URL);

            expect(decodeURIComponent(url.username)).toBe(
                expected.POSTGRES_USER
            );
            expect(decodeURIComponent(url.password)).toBe(
                expected.POSTGRES_PASSWORD
            );
            expect(url.hostname).toBe(expected.POSTGRES_HOST);
            expect(url.port).toBe(expected.POSTGRES_PORT);
            expect(decodeURIComponent(url.pathname.slice(1))).toBe(
                expected.POSTGRES_DB
            );
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
