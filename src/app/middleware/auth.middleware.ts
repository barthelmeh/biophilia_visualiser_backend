import { NextFunction, Request, Response } from 'express';
import Logger from '../../config/logger';
import { getAdministratorByToken } from '../models/user.model';

const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const token = req.header('X-Authorisation');
        const user = await getAdministratorByToken(token);

        if(user == null) {
            res.statusMessage = 'Unauthorised';
            res.status(401).send();
            return;
        }
        req.body.authId = user.id;
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