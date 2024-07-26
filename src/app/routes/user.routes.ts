import { Express } from "express";
import { rootUrl } from "./base.routes";
import * as user from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";

module.exports = (app: Express) => {
    app.route(rootUrl + '/login')
    .post(user.login);

    app.route(rootUrl + '/logout')
    .post(authenticate, user.logout);

    app.route(rootUrl + '/participant')
    .get(authenticate, user.getParticipants);

    app.route(rootUrl + '/participant')
    .post(user.createParticipant);

    app.route(rootUrl + '/participant/:id')
    .get(authenticate, user.getParticipant);

    app.route(rootUrl + '/participant/:id')
    .delete(authenticate, user.deleteParticipant);

}