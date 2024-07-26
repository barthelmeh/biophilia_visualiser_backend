import { Express } from "express";
import { rootUrl } from "./base.routes";
import * as user from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";

module.exports = (app: Express) => {
    app.route(rootUrl + '/login')
    .post(user.login);

    app.route(rootUrl + '/logout')
    .post(authenticate, user.logout);
}