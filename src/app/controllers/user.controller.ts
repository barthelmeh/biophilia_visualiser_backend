import { Request, Response } from 'express';
import Logger from '../../config/logger';
import * as User from '../models/user.model';
import * as Password from '../services/password';
import {uid} from 'rand-token';

const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.getAdministratorByUsername(req.body.username);

        if(user == null || !(await Password.compare(req.body.password, user.password))) {
            res.statusMessage = `Invalid username/password`;
            res.status(401).send();
            return;
        }

        // Generate the login token
        const token = uid(64);

        await User.login(user.id, token);

        res.status(200).send({"userId": user.id, "token": token});
        return;

    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
}

export { login }