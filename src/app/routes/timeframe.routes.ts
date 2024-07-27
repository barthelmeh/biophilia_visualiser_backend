import { Express } from "express";
import { rootUrl } from "./base.routes";
import * as timeframe from "../controllers/timeframe.controller";
import { authenticate } from "../middleware/auth.middleware";

module.exports = (app: Express) => {
    app.route(rootUrl + '/timeframe')
    .post(authenticate, timeframe.createTimeframe);

    app.route(rootUrl + '/timeframe/:id')
    .delete(authenticate, timeframe.deleteTimeframe);

    app.route(rootUrl + '/timeframe/:id')
    .patch(authenticate, timeframe.updateTimeframe);
}