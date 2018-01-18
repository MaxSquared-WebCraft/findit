import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as health from 'express-ping';

import {useContainer, useExpressServer} from 'routing-controllers';
import {Container} from 'typedi';

import {setupLogging} from './Logging';
import {DocumentController} from '../controllers/DocumentController';

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

    setupControllers() {
        const controllersPath = path.resolve('dist', 'controllers');
        useContainer(Container);

        useExpressServer(this.app, {
            controllers: [DocumentController]
        });
    }

}
