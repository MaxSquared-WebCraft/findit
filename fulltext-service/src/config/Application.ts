import {ExpressConfig} from './Express';
import {logger} from '../common/logging';
import * as config from 'config';

export class Application {
    server: any;
    express: ExpressConfig;

    constructor() {
        this.express = new ExpressConfig();
        const port = config.get('ports.http');

        this.server = this.express.app.listen(port, () => {
            logger.info(`
        ------------
        Server Started!

        Http: http://localhost:${port}
        Health: http://localhost:${port}/ping
        
        ------------
      `);
        });
    }
}
