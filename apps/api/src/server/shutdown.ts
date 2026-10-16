import type EventEmitter from 'node:events';

import { closePool } from '../db/pool';
import { logger } from '../logger';

export const SHUTDOWN_SIGNALS: readonly NodeJS.Signals[] = [
    'SIGTERM',
    'SIGINT',
];

let shutdownSignal: NodeJS.Signals | undefined;

export const isShuttingDown = () => !!shutdownSignal;

const signalShutdown = (signal: NodeJS.Signals) => {
    shutdownSignal = signal;
};

export type ClosableServerCallback = (err?: Error) => void;
type ClosableServer = {
    close: (callback: ClosableServerCallback) => void;
};

const closeServerAsync = (server: ClosableServer) =>
    new Promise<void>((resolve, reject) => {
        server.close((err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });

export const registerShutdownCallbacks = ({
    emitter = process,
    server,
    delay = 0,
    timeout = 0,
}: {
    emitter?: EventEmitter;
    server: ClosableServer;
    delay?: number;
    timeout?: number;
}) => {
    for (const signal of SHUTDOWN_SIGNALS) {
        emitter.once(signal, () => {
            logger.info({ signal }, 'Received shutdown signal');
            if (isShuttingDown()) {
                logger.warn(
                    { signal, shutdownSignal },
                    'Already shutting down'
                );
                return;
            }

            signalShutdown(signal);
            void (async () => {
                let timeoutTimer: NodeJS.Timeout | undefined;
                try {
                    if (delay > 0) {
                        await new Promise((resolve) =>
                            setTimeout(resolve, delay)
                        );
                        logger.debug({ delay }, 'Drain delay finished');
                    }
                    if (timeout > 0) {
                        timeoutTimer = setTimeout(() => {
                            logger.error({ timeout }, 'Shutdown timed out');
                            process.exit(1);
                        }, timeout);
                    }
                    await closeServerAsync(server);
                    logger.debug('HTTP server closed');
                    await closePool();
                    logger.debug('Database pool closed');
                    logger.info('Shutdown complete');
                    process.exit(0);
                } catch (err) {
                    logger.error({ err }, 'Error during shutdown');
                    process.exit(1);
                } finally {
                    clearTimeout(timeoutTimer);
                }
            })();
        });
    }
};
