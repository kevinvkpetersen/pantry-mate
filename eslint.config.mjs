// @ts-check

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
        plugins: { 'simple-import-sort': simpleImportSort },
        rules: {
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
            '@typescript-eslint/consistent-type-imports': 'error',
        },
    },
    {
        files: ['**/*.{js,mjs,cjs}'],
        extends: [js.configs.recommended, tseslint.configs.disableTypeChecked],
        plugins: { 'simple-import-sort': simpleImportSort },
        rules: {
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
        },
    },
    {
        files: ['apps/mobile/**/*.{js,jsx,ts,tsx}'],
        extends: [expoConfig],
        rules: {
            'import/no-unresolved': 'off',
        },
    },
    eslintConfigPrettier,
]);
