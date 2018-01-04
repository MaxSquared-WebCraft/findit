import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as health from 'express-ping';

import {Action, useContainer, useExpressServer} from 'routing-controllers';
import {createConnection, useContainer as useContainerORM} from 'typeorm';
import {UserController} from '../controllers/UserController';
import {RoleController} from '../controllers/RoleController';
import {AuthController} from '../controllers/AuthController';
import {getPayload} from '../util/RoleHelper';
import {RoleModel} from '../models/RoleModel';
import {UserModel} from '../models/UserModel';
import {setUpDatabase} from './SetupDB';
import {setupLogging} from './Logging';
import {Container} from 'typedi';
import * as config from 'config';

export class ExpressConfig {
    app: express.Express;

    constructor() {
        this.app = express();
        setupLogging(this.app);

        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(health.ping());

        this.setupControllers();
    }

    async setupControllers() {
        useContainer(Container);
        useContainerORM(Container);

        let connection = await createConnection({
            type: "mysql",
            host: config.get('mysql.url').toString(),
            port: 3306,
            database: 'findit',
            username: config.get('mysql.user').toString(),
            password: config.get('mysql.password').toString(),
            synchronize: true,
            logging: false,
            entities: [
                RoleModel,
                UserModel
            ]
        });

        await setUpDatabase(connection);

        useExpressServer(this.app, {
            authorizationChecker: async (action: Action, roles: string[]) => {
                const token = action.request.headers["Authorization"];
                const payload = getPayload(token);

                if (payload && payload.uuid && !roles.length)
                    return true;
                return !!(payload && roles.find(role => payload.role == role).length > 0);
            },
            currentUserChecker: async (action: Action) => {
                const token = action.request.headers["Authorization"];
                return getPayload(token);
            },
            controllers: [UserController, RoleController, AuthController]
        });
    }
}
