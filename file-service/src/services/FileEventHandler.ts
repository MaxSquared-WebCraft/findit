import { Inject, Service } from "typedi";
import { Consumer, Message } from "kafka-node";
import { ConsumerFactory } from "../events/ConsumerFactory";
import { OrmConnection } from "typeorm-typedi-extensions";
import { Connection } from "typeorm";

type CbFunction = (message: Message) => void

@Service()
export class FileUploadedHandler {

  private static FILE_UPLOADED = 'FILE_UPLOADED';
  private static FILE_DELETED = 'FILE_DELETED';

  @OrmConnection()
  private connection: Connection;

  private consumer: Consumer;

  constructor(private consumerFactory: ConsumerFactory) {

    const topics = [
      { topic: FileUploadedHandler.FILE_UPLOADED },
      { topic: FileUploadedHandler.FILE_DELETED },
    ];

    this.consumer = this.consumerFactory.createConsumer(topics);
  }

  public startHandlers = () => {
    this.registerConsumerOnTopic(FileUploadedHandler.FILE_UPLOADED, this.handleFileUploaded);
    this.registerConsumerOnTopic(FileUploadedHandler.FILE_DELETED, this.handleFileDeleted);
  };

  private registerConsumerOnTopic = (topic: string, callback: CbFunction) => {
    this.consumer.on('message', (message) => {
      message.topic === topic && callback(message);
    })
  };

  private handleFileUploaded = (message: Message) => {
    console.log('FILE_UPLOADED event received\n', message);
  };

  private handleFileDeleted = (message: Message) => {
    console.log('FILE_DELETED event received\n', message)
  };
}