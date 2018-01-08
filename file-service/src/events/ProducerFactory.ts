import { Producer } from "kafka-node";
import { Inject, Service } from "typedi";
import { ClientFactory } from "./ClientFactory";

@Service()
export class ProducerFactory {

  @Inject()
  private clientFactory: ClientFactory;

  getProducer(): Producer {
    return new Producer(this.clientFactory.getClient())
  }
}