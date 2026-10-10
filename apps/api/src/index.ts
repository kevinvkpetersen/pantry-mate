import express from 'express';
import items from './routes/items';
import config from './config';

const app = express();
const PORT = config.API_PORT;

app.use('/items', items);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
