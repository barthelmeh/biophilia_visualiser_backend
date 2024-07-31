import { Request, Response } from 'express';
import Logger from '../../config/logger';
import * as Admin from '../models/admin.model';
import * as Password from '../services/password';
import {uid} from 'rand-token';
import { validate } from '../services/validator';
import * as schema from '../resources/validation_schema.json';

// Administrator login
const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const validation = await validate(
            schema.login_admin,
            req.body);

        if (validation !== true) {
            res.statusMessage = `Bad Request: ${validation.toString()}`;
            res.status(400).send();
            return;
        }

        const admin = await Admin.getAdministratorByUsername(req.body.username);

        if(admin == null || !(await Password.compare(req.body.password, admin.password))) {
            res.statusMessage = `Invalid username/password`;
            res.status(401).send();
            return;
        }

        // Generate the login token
        const token = uid(64);

        await Admin.login(admin.id, token);

        res.status(200).send({"adminId": admin.id, "token": token});
        return;

    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
}


// Administrator logout
const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        const authId = req.body.authId;
        await Admin.logout(authId);
        res.status(200).send();
        return;
    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
}

export { login, logout }