import { Service } from "typedi";
import { Client } from "kafka-node";

@Service()
export class ClientFactory {

  private client: Client;

  constructor() {
    this.client = new Client(process.env.KAFKA_HOST);
  }

  getClient() {
    if (!this.client) throw new Error('Kafka client not yet initialized...');
    return this.client;
  }

}