import { config } from './config';
import { logger } from './logger';
import { app } from './server/app';
import { registerShutdownCallbacks } from './server/shutdown';

const server = app.listen(config.API_PORT, () =>
    logger.info(`Listening on port ${config.API_PORT}`)
);

registerShutdownCallbacks({
    server,
    delay: config.SHUTDOWN_DRAIN_DELAY_MS,
    timeout: config.SHUTDOWN_TIMEOUT_MS,
});
