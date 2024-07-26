import { Request, Response } from 'express';
import Logger from '../../config/logger';
import * as User from '../models/user.model';
import * as Password from '../services/password';
import {uid} from 'rand-token';


// Create a participant
const createParticipant = async (req: Request, res: Response): Promise<void> => {
    try {
        const newParticipant: ParticipantRegister = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            age: req.body.age as number,
            gender: req.body.gender,
            activityLevel: req.body.activityLevel,
            hasAcceptedTerms: req.body.hasAcceptedTerms,
        };

        const insertedId = await User.registerParticipant(newParticipant);

        if(insertedId == null) {
            res.statusMessage = 'Unable to insert participant';
            res.status(422).send();
            return;
        }
        res.status(201).send({"userId": insertedId});
        return;
    } catch (err) {
        Logger.error(err);
        res.statusMessage = 'Internal server error';
        res.status(500).send();
        return;
    }
}


// Get all participants
const getParticipants = async (req: Request, res: Response): Promise<void> => {
    try {
        const participants: Participant[] = await User.getAllParticipants();
        res.status(200).send(participants);
        return;
    } catch (err) {
        Logger.error(err);
        res.statusMessage = 'Internal server error';
        res.status(500).send();
        return;
    }
}


// Administrator login
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


// Administrator logout
const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        const authId = req.body.authId;
        await User.logout(authId);
        res.status(200).send();
        return;
    } catch (err) {
        Logger.error(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
}

export { createParticipant, getParticipants, login, logout }