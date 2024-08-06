import { Request, Response } from 'express';
import Logger from '../../config/logger';
import * as Participant from '../models/participant.model';
import { validate } from '../services/validator';
import * as schema from '../resources/validation_schema.json';

// Create a participant
const createParticipant = async (req: Request, res: Response): Promise<void> => {
    try {
        const validation = await validate(
            schema.create_participant,
            req.body);

        if (validation !== true) {
            res.statusMessage = `Bad Request: ${validation.toString()}`;
            res.status(400).send();
            return;
        }

        const newParticipant: ParticipantRegister = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            age: req.body.age as number,
            gender: req.body.gender,
            activityLevel: req.body.activityLevel,
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

        if (isNaN(id)) {
            res.statusMessage = "Id must be an integer"
            res.status(400).send();
            return;
        }

        const participant: Participant | null = await Participant.getParticipant(id);

        if(participant == null) {
            res.status(404).send('Participant not found');
            return;
        }

        res.status(200).send(participant);
        return;
    } catch (err) {
        Logger.error(err);
        res.statusMessage = 'Internal server error';
        res.status(500).send();
        return;
    }
}


// Delete participant
const deleteParticipant = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
            res.statusMessage = "Id must be an integer"
            res.status(400).send();
            return;
        }

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

const patchParticipant = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
            res.statusMessage = "Id must be an integer"
            res.status(400).send();
            return;
        }

        const validation = await validate(
            schema.patch_participant,
            req.body);

        if (validation !== true) {
            res.statusMessage = `Bad Request: ${validation.toString()}`;
            res.status(400).send();
            return;
        }

        const updatedParticipant: ParticipantUpdate = {
            ...req.body,
            id
        };

        const rowsAffected = await Participant.updateParticipant(updatedParticipant);

        if(rowsAffected > 0) {
            res.status(200).send();
            return;
        }

        res.status(404).send();
        return;


    } catch (err) {
        Logger.error(err);
        res.statusMessage = 'Internal server error';
        res.status(500).send();
    }
}

export { createParticipant, getParticipants, getParticipant, deleteParticipant, patchParticipant }