import {ExpressConfig} from './Express';
import {logger} from '../common/logging';
import * as config from 'config';

export class Application {
    server: any;
    express: ExpressConfig;

    constructor() {
        this.express = new ExpressConfig();

        const port = config.get('ports.http');
        const debugPort = config.get('ports.debug');

        this.server = this.express.app.listen(port, () => {
            logger.info(`
        ------------
        Server Started!

        Http: http://localhost:${port}
        Debugger: http://127.0.0.1:${port}/?ws=127.0.0.1:${port}&port=${debugPort}
        Health: http://localhost:${port}/ping
        ------------
      `);
        });
    }
}
