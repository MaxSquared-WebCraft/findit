import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { UserRepository } from '../repositorys/UserRepository';
import { UserModel } from '../models/UserModel';
import { logger } from '../common/logging';
import * as kafka from 'kafka-node';

@Service()
export class KafkaHandler {

  producer: kafka.Producer;
  consumer: kafka.SimpleConsumer;

    constructor(@OrmRepository() private readonly userRepository: UserRepository) {
        this.setupKafka();
    }

  async setupKafka() {
    logger.info(`Kafka host: ${process.env.KAFKA_HOST}`);
    this.producer = new kafka.Producer(new kafka.Client(process.env.KAFKA_HOST));
    this.producer.on('ready', () => {
      logger.info('Producer ready, initializing kafka...');
      this.setupWhenProducerReady();
    });

    this.consumer = new kafka.Consumer(new kafka.Client(process.env.KAFKA_HOST),
      [
        { topic: 'USER_CREATED' },
        { topic: 'USER_CHANGED' },
        { topic: 'USER_DELETED' }
      ], {
        groupId: 'user-service-consumer' + Math.random().toString(36).substring(7)
      }
    );
  }

  setupWhenProducerReady() {
    this.producer.on('error', (err) => {
      logger.log('error', err);
    });

    this.consumer.on('message', (message) => {
      this.handleIncoming(message);
    });
  }

  sendEvent(event: string, data: any) {
    this.producer.send([{
      topic: event,
      messages: JSON.stringify(data)
    }], (err, result) => {
      if (result)
        logger.log('info', result);
      if (err)
        logger.log('error', result);
    });
  }

  async handleIncoming(event: any) {
    const obj = JSON.parse(event.value);
    logger.info(`Handle ${event.topic} event`);
    switch (event.topic) {
      case 'USER_CREATED':
        await this.userRepository.registerUser(new UserModel(obj));
        break;
      case 'USER_CHANGED':
        await this.userRepository.save(obj);
        break;
      case 'USER_DELETED':
        await this.userRepository.deleteById(obj);
        break;
      default:
        break;
    }
  }
}