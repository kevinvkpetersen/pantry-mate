import type { Request, Response } from 'express';
import { describe, expect, it } from 'vitest';

import { requestLogLevel } from './logger';

const request = (originalUrl: string) => ({ originalUrl }) as Request;
const response = (statusCode: number) => ({ statusCode }) as Response;

describe('requestLogLevel', () => {
    it.each([
        { url: '/health', status: 200, expected: 'silent' },
        { url: '/health?verbose=1', status: 200, expected: 'silent' },
        { url: '/health', status: 503, expected: 'error' },
        { url: '/items', status: 200, expected: 'info' },
        { url: '/items', status: 404, expected: 'warn' },
        { url: '/items', status: 500, expected: 'error' },
    ])(
        'logs $url with status $status at $expected',
        ({ url, status, expected }) => {
            expect(requestLogLevel(request(url), response(status))).toBe(
                expected
            );
        }
    );

    it('logs at error when the response failed, even with a success status', () => {
        const err = new Error('connection aborted');

        expect(requestLogLevel(request('/health'), response(200), err)).toBe(
            'error'
        );
    });
});
