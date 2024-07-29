import { NextFunction, Request, Response } from 'express';
import Logger from '../../config/logger';
import { getAdministratorByToken } from '../models/admin.model';

const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const token = req.header('X-Authorisation');
        const admin = await getAdministratorByToken(token);

        if(admin == null) {
            res.statusMessage = 'Unauthorised';
            res.status(401).send();
            return;
        }
        req.body.authId = admin.id;
        next();
        return;
    } catch (err) {
        Logger.error(err);
        res.statusMessage = 'Internal server error';
        res.status(500).send();
        return;
    }
}

export { authenticate }