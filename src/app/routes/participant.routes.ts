import { Express } from "express";
import { rootUrl } from "./base.routes";
import * as participant from "../controllers/participant.controller";
import { authenticate } from "../middleware/auth.middleware";

module.exports = (app: Express) => {

    app.route(rootUrl + '/participant')
    .get(authenticate, participant.getParticipants);

    app.route(rootUrl + '/participant')
    .post(authenticate, participant.createParticipant);

    app.route(rootUrl + '/participant/:id')
    .get(authenticate, participant.getParticipant);

    app.route(rootUrl + '/participant/:id')
    .delete(authenticate, participant.deleteParticipant);

}