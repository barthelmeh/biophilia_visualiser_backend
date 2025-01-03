import express from "express";
import bodyParser from "body-parser";
import Logger from "./logger";

export default () => {
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.raw({type: 'text/plain'}));

    // Debug
    app.use((req, res, next) => {
        if(req.path !== '/'){
            Logger.http(`##### ${req.method} ${req.path} #####`);
        }
        next();
    });

    // ROUTES
    require('../app/routes/admin.routes')(app);
    require('../app/routes/participant.routes')(app);
    require('../app/routes/session.routes')(app);
    require('../app/routes/timeframe.routes')(app);

    return app;
}