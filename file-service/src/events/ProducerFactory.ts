import { Producer, ProduceRequest } from "kafka-node";
import { Inject, Service } from "typedi";
import { ClientFactory } from "./ClientFactory";

@Service()
export class ProducerFactory {

  @Inject()
  private clientFactory: ClientFactory;

  getProducer(): Producer {
    return new Producer(this.clientFactory.getClient())
  }

  private static stdCallback = (err: any, data: any): void => {
    if (err) return console.error('error', err);
    console.log('sent', data);
  };

  public static registerAsyncProducer = (producer: Producer,
                                         payloads: ProduceRequest[],
                                         cb: (error: any, data: any) => Promise<any>): Promise<any> => {
    return new Promise((resolve, reject) => {
      producer.send(payloads, (error, data) => {
        cb(error, data).then(resolve).catch(reject);
      });
    });
  };

  public static sendProducerEvent = (producer: Producer,
                                     payloads: ProduceRequest[],
                                     cb?: (err: any, data: any) => void): void => {
    const callback = cb || ProducerFactory.stdCallback;
    producer.send(payloads, callback)
  }
}