import express, { Request, Response } from 'express';
import { listItems } from '../repositories/items';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    return res.json(await listItems());
});

export default router;
