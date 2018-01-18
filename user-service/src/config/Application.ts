import {ExpressConfig} from './Express';
import {logger} from '../common/logging';

export class Application {
    server: any;
    express: ExpressConfig;

    constructor() {
        this.express = new ExpressConfig();
        const port =  process.env.HTTP_HOST || 8081;
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
