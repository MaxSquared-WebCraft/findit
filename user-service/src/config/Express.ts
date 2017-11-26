import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as health from 'express-ping';

import {Action, useContainer, useExpressServer} from 'routing-controllers';
import {Container} from 'typedi';

import {setupLogging} from './Logging';
import {setupAuth} from './Authentication';
import {UserController} from '../controllers/UserController';
import {RoleController} from '../controllers/RoleController';
import {AuthController} from '../controllers/AuthController';
import {getPayload} from '../util/RoleHelper';

export class ExpressConfig {

    app: express.Express;

    constructor() {
        this.app = express();

        setupLogging(this.app);
        setupAuth(this.app);

        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(health.ping());

        this.setupControllers();
    }

    setupControllers() {
        const controllersPath = path.resolve('dist', 'controllers');

        useContainer(Container);

        useExpressServer(this.app, {
            authorizationChecker: async (action: Action, roles: string[]) => {
                const token = action.request.headers["Authorization"];
                const payload = getPayload(token);

                if (payload && payload.id && !roles.length)
                    return true;
                if (payload && roles.find(role => payload.role == role).length > 0)
                    return true;

                return false;
            },
            currentUserChecker: async (action: Action) => {
                const token = action.request.headers["Authorization"];
                return getPayload(token);
            },
            controllers: [UserController, RoleController, AuthController]
        });
    }
}
