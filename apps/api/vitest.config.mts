import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        projects: [
            {
                test: {
                    name: 'unit',
                    include: ['src/**/*.test.ts'],
                    env: {
                        DB_HOST: 'unit-test-host.invalid',
                        DB_PORT: '5432',
                        DB_USER: 'unit-test-user',
                        DB_PASSWORD: 'unit-test-password',
                        DB_NAME: 'unit-test-db',
                        LOG_LEVEL: 'silent',
                    },
                },
            },
            {
                test: {
                    name: 'integration',
                    include: ['test/**/*.test.ts'],
                    env: {
                        LOG_LEVEL: 'silent',
                    },
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
    ssr: {
        resolve: {
            conditions: [
                '@pantry-mate/source',
                'module',
                'node',
                'development|production',
            ],
        },
    },
});
