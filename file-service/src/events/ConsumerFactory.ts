import { Consumer, ConsumerOptions, OffsetFetchRequest } from 'kafka-node'
import { Inject, Service } from "typedi";
import { ClientFactory } from "./ClientFactory";

@Service()
export class ConsumerFactory {

  @Inject()
  private clientFactory: ClientFactory;

  createConsumer(fetchRequests: Array<OffsetFetchRequest>, options?: ConsumerOptions): Consumer {
    return new Consumer(this.clientFactory.getClient(), fetchRequests, options)
  }
}