import {Service} from 'typedi';
import {logger} from '../common/logging';
import * as kafka from 'kafka-node';
import * as config from 'config';
import {ElasticSearchService} from '../services/ElasticSearchService';

@Service()
export class KafkaHandler {
    producer: kafka.Producer;
    consumer: kafka.SimpleConsumer;

    constructor(private readonly elasticSearch: ElasticSearchService) {
        this.setupKafka();
    }

    async setupKafka() {
        this.producer = new kafka.Producer(new kafka.Client(process.env.KAFKA_HOST));
        this.producer.on('ready', () => { this.setupWhenProducerReady(); });
        this.consumer = new kafka.Consumer(new kafka.Client(process.env.KAFKA_HOST),
            [{ topic: 'METADATA_EXTRACTED' }],
            { groupId: 'fulltext-service-consumer' + Math.random().toString(36).substring(7) }
        );
    }

    setupWhenProducerReady() {
        this.producer.on('error', (err) => { logger.log('error', err); });
        this.consumer.on('message', (message) => {
            this.handleIncoming(message);
        });
    }

    async handleIncoming(event: any) {
        const obj = JSON.parse(event.value);
        await this.elasticSearch.addDocumentToUser(obj.userId, obj.fileId, obj.metadata);
    }
}
