import { createRequire } from 'node:module';

import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

const require = createRequire(import.meta.url);
const expoConfig = require('eslint-config-expo/flat');

export default defineConfig([
    globalIgnores(['**/dist', '**/.expo', '**/coverage']),
    {
        files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
        plugins: { 'simple-import-sort': simpleImportSort },
        rules: {
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
            'object-shorthand': 'error',
            eqeqeq: 'error',
        },
    },
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommendedTypeChecked,
        ],
        languageOptions: {
            parserOptions: {
                projectService: true,
            },
        },
        rules: {
            '@typescript-eslint/consistent-type-imports': 'error',
            '@typescript-eslint/switch-exhaustiveness-check': 'error',
        },
    },
    {
        files: ['**/*.{js,mjs,cjs}'],
        extends: [js.configs.recommended, tseslint.configs.disableTypeChecked],
    },
    {
        files: ['apps/mobile/**/*.{js,jsx,ts,tsx}'],
        extends: [expoConfig],
        rules: {
            'import/no-unresolved': 'off',
        },
    },
    {
        files: ['apps/api/src/**/*.ts'],
        ignores: ['apps/api/src/config/**', 'apps/api/src/**/*.test.ts'],
        rules: {
            'no-restricted-properties': [
                'error',
                {
                    object: 'process',
                    property: 'env',
                    message:
                        'Read environment variables through src/config, not process.env.',
                },
            ],
        },
    },
    {
        files: ['apps/api/src/**/*.ts'],
        ignores: ['apps/api/src/**/*.test.ts'],
        rules: {
            'no-console': 'error',
        },
    },
    eslintConfigPrettier,
]);
