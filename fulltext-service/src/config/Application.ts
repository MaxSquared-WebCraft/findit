import { ExpressConfig } from './Express';
import { logger } from '../common/logging';
import { Service } from "typedi";
import { KafkaHandler } from "../kafka/Kafka";

@Service()
export class Application {

  server: any;
  express: ExpressConfig;

  constructor(private readonly kafka: KafkaHandler) {

    logger.info('Kafka initialized', kafka);

    this.express = new ExpressConfig();
    const port = process.env.HTTP_HOST;

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
