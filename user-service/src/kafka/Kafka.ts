import {UserModel} from '../models/UserModel';

import * as kafka  from 'kafka-node';
import {Service} from 'typedi';
import {OrmRepository} from 'typeorm-typedi-extensions';
import {UserRepository} from '../repositorys/UserRepository';
import {logger} from '../common/logging';

@Service()
export class KafkaHandler {
    producer: kafka.Producer;
    consumer: kafka.SimpleConsumer;

    constructor(@OrmRepository() private readonly userRepository: UserRepository) {
        this.setupKafka();
    }

    async setupKafka() {
        this.producer = new kafka.Producer(new kafka.Client('zaunerserver.ddns.net:49312'));
        this.producer.on('ready', () => {
            this.setupWhenProducerReady();
        });

        this.consumer = new kafka.Consumer(new kafka.Client('zaunerserver.ddns.net:49312'),
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
            console.log(message.topic, message.value);
            this.handleIncoming(event);
        });
    }

    sendEvent(event: string, data: any) {
        this.producer.send([{
            topic: event,
            messages: JSON.stringify(data)
        }], (err, result) => {
            if(result)
                logger.log('info', result);
            if(err)
                logger.log('error', result);
        });
    }

    handleIncoming(event:any) {
        let obj = JSON.parse(event.value);
        switch (event.topic) {
            case 'USER_CREATED':
                this.userRepository.registerUser(new UserModel(obj));
                break;
            case 'USER_CHANGED':
                this.userRepository.save(obj);
                break;
            case 'USER_DELETED':
                this.userRepository.deleteById(obj);
                break;
            default:
                break;
        }
    }
}