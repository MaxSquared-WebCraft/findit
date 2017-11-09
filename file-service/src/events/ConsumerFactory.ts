import { Consumer, ConsumerOptions, OffsetFetchRequest } from "kafka-node";
import { Inject, Service } from "typedi";
import { ClientFactory } from "./ClientFactory";
import { WinstonLoggerImpl } from "../common/WinstonLoggerImpl";
import { ILogger } from "../config/Application";

@Service()
export class ConsumerFactory {

  @Inject()
  private readonly clientFactory: ClientFactory;

  @Inject(WinstonLoggerImpl)
  private readonly logger: ILogger;

  createConsumer(fetchRequests: OffsetFetchRequest[], options?: ConsumerOptions): Consumer {
    this.logger.info("Creating consumer with options: %j", options || {});
    return new Consumer(this.clientFactory.getClient(), fetchRequests, options);
  }
}
