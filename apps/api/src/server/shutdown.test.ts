import EventEmitter from 'node:events';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { closePool } from '../db/pool';
import type * as ShutdownModule from './shutdown';
import type { ClosableServerCallback } from './shutdown';
import { SHUTDOWN_SIGNALS } from './shutdown';

let isShuttingDown: typeof ShutdownModule.isShuttingDown;
let registerShutdownCallbacks: typeof ShutdownModule.registerShutdownCallbacks;

let emitter: EventEmitter;
let server: { close: (callback: ClosableServerCallback) => void };

vi.mock('../db/pool', () => ({
    closePool: vi.fn(() => Promise.resolve()),
}));

const exitSpy = vi
    .spyOn(process, 'exit')
    .mockImplementation(() => undefined as never);

describe('shutdown', () => {
    beforeEach(async () => {
        vi.resetModules();
        emitter = new EventEmitter();
        server = {
            close: vi.fn((callback: ClosableServerCallback) => callback()),
        };
        ({ isShuttingDown, registerShutdownCallbacks } =
            await import('./shutdown.js'));
    });

    it('should call the shutdown commands in the correct order', async () => {
        let finishServerClose: ClosableServerCallback | undefined;
        server.close = vi.fn((callback: ClosableServerCallback) => {
            finishServerClose = callback;
        });

        const pool = Promise.withResolvers<void>();
        vi.mocked(closePool).mockReturnValueOnce(pool.promise);

        registerShutdownCallbacks({ emitter, server });

        emitter.emit('SIGTERM');

        expect(isShuttingDown()).toBe(true);

        await vi.waitFor(() => expect(server.close).toHaveBeenCalledTimes(1));
        expect(closePool).not.toHaveBeenCalled();

        expect(finishServerClose).toBeDefined();
        finishServerClose?.();

        await vi.waitFor(() => expect(closePool).toHaveBeenCalledTimes(1));
        expect(exitSpy).not.toHaveBeenCalled();

        pool.resolve();

        await vi.waitFor(() => expect(exitSpy).toHaveBeenCalledTimes(1));
        expect(exitSpy).toHaveBeenCalledWith(0);
        expect(closePool).toHaveBeenCalledBefore(exitSpy);
    });

    it('should not call any shutdown commands if the signal is not received', async () => {
        registerShutdownCallbacks({ emitter, server });

        // DO NOT EMIT ANY SIGNALS

        // Let any pending async work run before checking
        await new Promise((resolve) => setImmediate(resolve));

        expect(isShuttingDown()).toBe(false);
        expect(server.close).not.toHaveBeenCalled();
        expect(closePool).not.toHaveBeenCalled();
        expect(exitSpy).not.toHaveBeenCalled();
    });

    it.each(SHUTDOWN_SIGNALS)('should be triggered by %s', async (signal) => {
        registerShutdownCallbacks({ emitter, server });

        emitter.emit(signal);

        // Let any pending async work run before checking
        await new Promise((resolve) => setImmediate(resolve));

        expect(isShuttingDown()).toBe(true);
        expect(server.close).toHaveBeenCalledTimes(1);
        expect(closePool).toHaveBeenCalledTimes(1);
        expect(exitSpy).toHaveBeenCalledTimes(1);
        expect(exitSpy).toHaveBeenCalledWith(0);
    });

    it('should only run once even if multiple signals are received', async () => {
        registerShutdownCallbacks({ emitter, server });
        for (const signal of SHUTDOWN_SIGNALS) {
            emitter.emit(signal);
        }

        // Let any pending async work run before checking
        await new Promise((resolve) => setImmediate(resolve));

        expect(isShuttingDown()).toBe(true);
        expect(server.close).toHaveBeenCalledTimes(1);
        expect(closePool).toHaveBeenCalledTimes(1);
        expect(exitSpy).toHaveBeenCalledTimes(1);
        expect(exitSpy).toHaveBeenCalledWith(0);
    });
});
