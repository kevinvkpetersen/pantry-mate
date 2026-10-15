import type EventEmitter from 'node:events';

import { closePool } from '../db/pool';

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
}: {
    emitter?: EventEmitter;
    server: ClosableServer;
}) => {
    const signal = 'SIGTERM';
    emitter.once(signal, () => {
        console.log(`Received ${signal}`);
        signalShutdown(signal);
        void (async () => {
            await closeServerAsync(server);
            await closePool();
            process.exit(0);
        })();
    });
};
