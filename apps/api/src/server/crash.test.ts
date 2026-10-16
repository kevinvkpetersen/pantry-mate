import EventEmitter from 'node:events';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { logger } from '../logger';
import { registerCrashHandlers } from './crash';

const exitSpy = vi
    .spyOn(process, 'exit')
    .mockImplementation(() => undefined as never);
const fatalSpy = vi.spyOn(logger, 'fatal');

describe('crash handlers', () => {
    let emitter: EventEmitter;

    beforeEach(() => {
        emitter = new EventEmitter();
        registerCrashHandlers({ emitter });
    });

    it('logs an uncaught exception and exits with code 1', () => {
        const err = new Error('boom');

        emitter.emit('uncaughtException', err);

        expect(fatalSpy).toHaveBeenCalledWith({ err }, 'Uncaught exception');
        expect(exitSpy).toHaveBeenCalledWith(1);
    });

    it('logs an unhandled rejection and exits with code 1', () => {
        const reason = new Error('rejected');

        emitter.emit('unhandledRejection', reason);

        expect(fatalSpy).toHaveBeenCalledWith(
            { err: reason },
            'Unhandled promise rejection'
        );
        expect(exitSpy).toHaveBeenCalledWith(1);
    });

    it('does nothing until an error is emitted', () => {
        expect(fatalSpy).not.toHaveBeenCalled();
        expect(exitSpy).not.toHaveBeenCalled();
    });
});
