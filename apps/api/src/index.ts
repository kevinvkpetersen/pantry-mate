import { app } from './app';
import { config } from './config';

app.listen(config.API_PORT, () =>
    console.log(`Listening on port ${config.API_PORT}`)
);
