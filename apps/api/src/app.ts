import express from 'express';

import items from './routes/items';

export const app = express();

app.use('/items', items);
