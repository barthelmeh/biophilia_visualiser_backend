import { Request, Response } from 'express';
import Logger from '../../config/logger';
import * as User from '../models/user.model';

const login = async (req: Request, res: Response): Promise<void> => {
    try {
        Logger.info("Attempting login");
    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
}

export { login }