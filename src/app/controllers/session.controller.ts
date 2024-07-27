import { Request, Response } from 'express';
import Logger from '../../config/logger';
import * as Session from '../models/session.model';


const createSession = async (req: Request, res: Response): Promise<void> => {
    try {
        const session: SessionCreate = {
            participantId: req.body.participantId as number,
            name: req.body.name,
            start: req.body.start,
            end: req.body.end,
            data: req.body.data
        }

        const insertedId = await Session.createSession(session);

        if(insertedId == null) {
            res.statusMessage = 'Unable to insert session or data';
            res.status(422).send();
            return;
        }
        res.status(201).send({"sessionId": insertedId});
        return;
    } catch (err) {
        Logger.error(err);
        res.statusMessage = 'Internal server error';
        res.status(500).send();
        return;
    }
}


// Get a session by its id
const getSession = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id, 10);
        const session: Session = await Session.getSessionById(id);

        res.status(200).send(session);
    } catch (err) {
        Logger.error(err);
        res.statusMessage = 'Internal server error';
        res.status(500).send();
        return;
    }
}


const deleteSession = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id, 10);
        const rowsAffected = await Session.deleteSession(id);

        if(rowsAffected > 0) {
            res.status(200).send();
            return;
        }

        res.status(204).send('No content');
        return;
    } catch (err) {
        Logger.error(err);
        res.statusMessage = 'Internal server error';
        res.status(500).send();
        return;
    }
}

export { createSession, getSession, deleteSession }