import express from 'express';

import health from '../routes/health';
import items from '../routes/items';

export const app = express();

app.use('/health', health);
app.use('/items', items);
