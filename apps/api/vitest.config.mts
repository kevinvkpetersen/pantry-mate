import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        projects: [
            {
                test: {
                    name: 'unit',
                    include: ['src/**/*.test.ts'],
                    env: {
                        POSTGRES_USER: 'unit-test-user',
                        POSTGRES_PASSWORD: 'unit-test-password',
                        POSTGRES_DB: 'unit-test-db',
                        POSTGRES_HOST: 'unit-test-host.invalid',
                        POSTGRES_PORT: '5432',
                        LOG_LEVEL: 'silent',
                    },
                },
            },
            {
                test: {
                    name: 'integration',
                    include: ['test/**/*.test.ts'],
                    globalSetup: ['test/setup/global-setup.ts'],
                    setupFiles: ['test/setup/setup.ts'],
                    fileParallelism: false,
                    testTimeout: 30_000,
                },
            },
        ],
        coverage: {
            provider: 'v8',
            include: ['src/**/*.ts'],
            exclude: ['src/**/index.ts', 'src/**/*.test.ts'],
            reporter: ['text', 'html'],
        },
    },
});
