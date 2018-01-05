import { Inject, Service } from "typedi";
import { Consumer } from "kafka-node";
import { ConsumerFactory } from "../events/Consumer";

@Service()
export class FileUploadedHandler {

  @Inject()
  private consumerFactory: ConsumerFactory;

  private consumer: Consumer;

  startHandlers() {

    const topics = [{ topic: 'FILE_UPLOADED' }];

    this.consumer = this.consumerFactory.createConsumer(topics);

    this.consumer.on('message', (message) => {
      console.log('MESSAGE INCOMMING:', message)
    })
  }
}