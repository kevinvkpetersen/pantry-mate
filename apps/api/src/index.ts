import { config } from './config';
import { logger } from './logger';
import { app } from './server/app';
import { registerCrashHandlers } from './server/crash';
import { registerShutdownCallbacks } from './server/shutdown';

registerCrashHandlers();

// Express 5 also calls this callback with the error if the server fails to start.
const server = app.listen(config.API_PORT, (err) => {
    if (err) {
        logger.fatal({ err, port: config.API_PORT }, 'Failed to start');
        process.exit(1);
    }
    logger.info({ port: config.API_PORT }, 'Listening');
});

registerShutdownCallbacks({
    server,
    delay: config.SHUTDOWN_DRAIN_DELAY_MS,
    timeout: config.SHUTDOWN_TIMEOUT_MS,
});
