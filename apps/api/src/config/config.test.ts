import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { Config } from './config';
import { type EnvKey, type OptionalEnv, REQUIRED_ENV } from './env';

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
};

const expectedValues = {
    API_PORT: 4321,
    DATABASE_URL: `postgres://${testValues.POSTGRES_USER}:${testValues.POSTGRES_PASSWORD}@${testValues.POSTGRES_HOST}:${testValues.POSTGRES_PORT}/${testValues.POSTGRES_DB}`,
};

// What config should become when each optional variable is unset.
const defaultsWhenMissing: Record<OptionalEnv, Partial<Config>> = {
    API_PORT: { API_PORT: 3000 },
    POSTGRES_HOST: {
        DATABASE_URL: `postgres://${testValues.POSTGRES_USER}:${testValues.POSTGRES_PASSWORD}@localhost:${testValues.POSTGRES_PORT}/${testValues.POSTGRES_DB}`,
    },
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
});
