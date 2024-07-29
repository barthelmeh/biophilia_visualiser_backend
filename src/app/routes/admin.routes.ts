import { Express } from 'express';
import { rootUrl } from './base.routes';
import * as admin from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth.middleware';

module.exports = (app: Express) => {
    app.route(rootUrl + '/admin/login')
    .post(admin.login);

    app.route(rootUrl + '/admin/logout')
    .post(authenticate, admin.logout);
}