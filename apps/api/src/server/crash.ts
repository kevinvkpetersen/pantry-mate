import type EventEmitter from 'node:events';

import { logger } from '../logger';

// With a listener attached, Node no longer exits on these by itself, so each handler must exit.
// The process may be in a broken state, so exit straight away instead of shutting down gracefully.
export const registerCrashHandlers = ({
    emitter = process,
}: { emitter?: EventEmitter } = {}) => {
    emitter.on('uncaughtException', (err: Error) => {
        logger.fatal({ err }, 'Uncaught exception');
        process.exit(1);
    });

    emitter.on('unhandledRejection', (reason: unknown) => {
        logger.fatal({ err: reason }, 'Unhandled promise rejection');
        process.exit(1);
    });
};
