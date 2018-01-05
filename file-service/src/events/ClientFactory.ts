import { Service } from "typedi";
import { Client } from "kafka-node";
import * as config from "config";

@Service()
export class ClientFactory {

  private client: Client;

  constructor() {
    this.client = null;
  }

  connectKafkaClient() {
    this.client = new Client(config.get("kafka.connectionString"));
  }

  getClient() {
    if (!this.client) throw new Error('Kafka client not yet initialized...');
    return this.client;
  }

}