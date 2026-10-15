import express from 'express';

import { isDatabaseAlive } from '../db/health';
import { isShuttingDown } from '../server/shutdown';

const router = express.Router();

router.get('/', async (req, res) => {
    if (isShuttingDown()) {
        return res.status(503).json({ status: 'shutting_down' });
    }

    if (!(await isDatabaseAlive())) {
        return res.status(503).json({ status: 'unavailable' });
    }

    res.status(200).json({ status: 'ok' });
});

export default router;
