import express from 'express';

import config from './config';
import items from './routes/items';

const app = express();
const PORT = config.API_PORT;

app.use('/items', items);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
