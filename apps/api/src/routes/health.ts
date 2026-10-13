import express from 'express';

import { isDatabaseAlive } from '../db/health';

const router = express.Router();

router.get('/', async (req, res) => {
    if (!(await isDatabaseAlive())) {
        return res.status(503).json({ status: 'unavailable' });
    }

    res.status(200).json({ status: 'ok' });
});

export default router;
