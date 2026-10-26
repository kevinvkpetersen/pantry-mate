import type { Request, Response } from 'express';
import express from 'express';

import { listLocations } from '../repositories/locations';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    return res.json(await listLocations());
});

export default router;
