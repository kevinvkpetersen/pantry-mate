import EventEmitter from 'node:events';

import { describe, expect, it, vi } from 'vitest';

import { closePool } from '../db/pool';
import type { ClosableServerCallback } from './shutdown';
import { isShuttingDown, registerShutdownCallbacks } from './shutdown';

vi.mock('../db/pool', () => ({
    closePool: vi.fn(() => Promise.resolve()),
}));

describe('shutdown', () => {
    it('should call the shutdown commands in the correct order', async () => {
        const emitter = new EventEmitter();
        let finishServerClose: ClosableServerCallback | undefined;
        const server = {
            close: vi.fn((callback: ClosableServerCallback) => {
                finishServerClose = callback;
            }),
        };
        const pool = Promise.withResolvers<void>();
        vi.mocked(closePool).mockReturnValueOnce(pool.promise);
        const exitSpy = vi
            .spyOn(process, 'exit')
            .mockImplementation(() => undefined as never);

        registerShutdownCallbacks({ emitter, server });

        emitter.emit('SIGTERM');

        expect(isShuttingDown()).toBe(true);

        await vi.waitFor(() => expect(server.close).toHaveBeenCalled());
        expect(closePool).not.toHaveBeenCalled();

        finishServerClose?.();

        await vi.waitFor(() => expect(closePool).toHaveBeenCalled());
        expect(exitSpy).not.toHaveBeenCalled();

        pool.resolve();

        await vi.waitFor(() => expect(exitSpy).toHaveBeenCalledWith(0));
        expect(closePool).toHaveBeenCalledBefore(exitSpy);
    });
});
