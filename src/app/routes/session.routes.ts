import { Express } from "express";
import { rootUrl } from "./base.routes";
import * as session from "../controllers/session.controller";
import { authenticate } from "../middleware/auth.middleware";

module.exports = (app: Express) => {
    app.route(rootUrl + '/session')
    .get(authenticate, session.getSessions);

    app.route(rootUrl + '/session')
    .post(authenticate, session.createSession);

    app.route(rootUrl + '/session/:id')
    .get(authenticate, session.getSession);

    app.route(rootUrl + '/session/:id')
    .delete(authenticate, session.deleteSession);
}