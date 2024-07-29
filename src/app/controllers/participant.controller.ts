import { Request, Response } from 'express';
import Logger from '../../config/logger';
import * as Participant from '../models/participant.model';

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

        const insertedId = await Participant.registerParticipant(newParticipant);

        if(insertedId == null) {
            res.statusMessage = 'Unable to insert participant';
            res.status(422).send();
            return;
        }
        res.status(201).send({"participantId": insertedId});
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
        const participants: Participant[] = await Participant.getAllParticipants();
        res.status(200).send(participants);
        return;
    } catch (err) {
        Logger.error(err);
        res.statusMessage = 'Internal server error';
        res.status(500).send();
        return;
    }
}


// Get a singular participant by id
const getParticipant = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id, 10);
        const participant: Participant | null = await Participant.getParticipant(id);

        if(participant == null) {
            res.status(404).send();
        }

        res.status(200).send(participant);
        return;
    } catch (err) {
        Logger.error(err);
        res.statusMessage = 'Internal server error';
        res.status(500).send();
    }
}


// Delete participant
const deleteParticipant = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id, 10);
        const rowsAffected = await Participant.deleteParticipant(id);

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

export { createParticipant, getParticipants, getParticipant, deleteParticipant }