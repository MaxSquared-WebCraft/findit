import { Inject, Service } from "typedi";
import { Client } from "kafka-node";
import { WinstonLoggerImpl } from "../common/WinstonLoggerImpl";
import { ILogger } from "../config/Application";

@Service()
export class ClientFactory {

  private readonly client: Client;

  constructor(@Inject(WinstonLoggerImpl) private readonly logger: ILogger) {
    this.logger.info(`Kafka host: ${process.env.KAFKA_HOST}`);
    this.client = new Client(process.env.KAFKA_HOST);
  }

  getClient() {
    if (!this.client) throw new Error("Kafka client not yet initialized...");
    return this.client;
  }

}
