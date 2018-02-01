import { Producer, ProduceRequest } from "kafka-node";
import { Inject, Service } from "typedi";
import { ClientFactory } from "./ClientFactory";
import { WinstonLoggerImpl } from "../common/WinstonLoggerImpl";
import { ILogger } from "../config/Application";

@Service()
export class ProducerFactory {

  @Inject()
  private clientFactory: ClientFactory;

  @Inject(WinstonLoggerImpl)
  private logger: ILogger;

  private producerReady: boolean = false;
  private producer: Producer;

  async initProducer(): Promise<any> {
    this.producer = new Producer(this.clientFactory.getClient());
    return new Promise((resolve) => {
      this.producer.on("ready", () => {
        this.logger.info("Producer is ready!");
        this.producerReady = true;
        resolve(true);
      });
    });
  }

  getProducer(): Producer {
    if (!this.producerReady) throw new Error("Producer is not ready yet, call the init method first");
    return this.producer;
  }

  public registerAsyncProducer = (producer: Producer,
                                  payloads: ProduceRequest[],
                                  cb: (error: any, data: any) => Promise<any>): Promise<any> => {
    return new Promise((resolve, reject) => {
      producer.send(payloads, (error, data) => {
        cb(error, data).then(resolve).catch(reject);
      });
    });
  };

  public sendProducerEvent = (producer: Producer,
                              payloads: ProduceRequest[],
                              cb?: (err: any, data: any) => void): void => {
    const callback = cb || this.stdCallback;
    producer.send(payloads, callback);
  };

  private stdCallback = (err: any, data: any): void => {
    if (err) return this.logger.error("error %j", err);
    this.logger.info('Sent event with data: %j', data);
  };
}
