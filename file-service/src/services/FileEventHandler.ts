import { Service } from "typedi";
import { Consumer, Message } from "kafka-node";
import { ConsumerFactory } from "../events/ConsumerFactory";
import { OrmConnection } from "typeorm-typedi-extensions";
import { Connection, Repository } from "typeorm";
import { User } from "../entities/User";
import { Document } from "../entities/Document";

type CbFunction = (message: Message) => void

interface FileUploadedEventData {
  location: string;
  userId: string;
  fileUuid: string;
}

@Service()
export class FileUploadedHandler {

  private static FILE_UPLOADED = 'FILE_UPLOADED';
  private static FILE_DELETED = 'FILE_DELETED';

  private documentRepo: Repository<Document>;
  private userRepo: Repository<User>;
  private consumer: Consumer;

  constructor(@OrmConnection() private connection: Connection,
              private consumerFactory: ConsumerFactory,) {

    const topics = [
      { topic: FileUploadedHandler.FILE_UPLOADED },
      { topic: FileUploadedHandler.FILE_DELETED },
    ];

    this.consumer = this.consumerFactory.createConsumer(topics);

    this.documentRepo = connection.getRepository(Document);
    this.userRepo = connection.getRepository(User);
  }

  public registerHandlers = () => {
    this.registerAsyncConsumerOnTopic(FileUploadedHandler.FILE_UPLOADED, this.handleFileUploaded);
    this.registerAsyncConsumerOnTopic(FileUploadedHandler.FILE_DELETED, this.handleFileDeleted);
  };

  private registerAsyncConsumerOnTopic = (topic: string, callback: CbFunction) => {
    this.consumer.on('message', (message) => {
      if (message.topic === topic)
        callback(message)
    })
  };

  private handleFileUploaded = async (message: Message) => {

    const { fileUuid, location, userId }: FileUploadedEventData = JSON.parse(message.value);

    let user = await this.userRepo.findOne({ uuid: userId });

    if (!user) {
      user = new User();
      user.uuid = userId;
    }

    const document = new Document();

    document.location = location;
    document.uuid = fileUuid;
    document.users = [user];

    this.documentRepo.save(document).catch(console.error);
  };

  private handleFileDeleted = async (message: Message) => {
    console.log('FILE_DELETED event received\n', message)
  };
}