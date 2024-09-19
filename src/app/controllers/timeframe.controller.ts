import { Request, Response } from 'express';
import Logger from '../../config/logger';
import * as Timeframe from '../models/timeframe.model';
import { validate } from '../services/validator';
import * as schema from '../resources/validation_schema.json';

const createTimeframe = async (req: Request, res: Response): Promise<void> => {
    try {
        const validation = await validate(
            schema.create_timeframe,
            req.body);

        if (validation !== true) {
            res.statusMessage = `Bad Request: ${validation.toString()}`;
            res.status(400).send();
            return;
        }

        const timeframe: TimeframeCreate = {
            sessionId: req.body.sessionId as number,
            description: req.body.description,
            startTime: req.body.startTime,
            endTime: req.body.endTime
        }

        const doesOverlap = await Timeframe.doesTimeframeOverlap(timeframe);
        if(doesOverlap) {
            res.status(409).send('Cannot create a timeframe during another timeframe');
            return;
        }

        const insertedId = await Timeframe.createTimeframe(timeframe);

        if(insertedId == null) {
            res.statusMessage = 'Unable to insert timeframe';
            res.status(422).send();
            return;
        }
        res.status(201).send({"timeframeId": insertedId});
        return;
    } catch (err) {
        Logger.error(err);
        res.statusMessage = 'Internal server error';
        res.status(500).send();
        return;
    }
}


const deleteTimeframe = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
            res.statusMessage = "Id must be an integer"
            res.status(400).send();
            return;
        }

        const rowsAffected = await Timeframe.deleteTimeframe(id);

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

const updateTimeframe = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
            res.statusMessage = "Id must be an integer"
            res.status(400).send();
            return;
        }

        const validation = await validate(
            schema.patch_timeframe,
            req.body);

        if (validation !== true) {
            res.statusMessage = `Bad Request: ${validation.toString()}`;
            res.status(400).send();
            return;
        }

        const updatedTimeframe: TimeframeUpdate = {
            ...req.body,
            id
        };
        const rowsAffected = await Timeframe.updateTimeframe(updatedTimeframe);

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
        return;
    }
}

export { createTimeframe, deleteTimeframe, updateTimeframe }