import { Service } from 'typedi';
import { logger } from '../common/logging';
import { Producer, Message, Consumer, Client } from 'kafka-node';
import { ElasticSearchService } from '../services/ElasticSearchService';

@Service()
export class KafkaHandler {

  private producer: Producer;
  private consumer: Consumer;

  constructor(private readonly elasticSearch: ElasticSearchService) {
    this.setupKafka();
  }

  async setupKafka() {
    this.producer = new Producer(new Client(process.env.KAFKA_HOST));
    this.producer.on('ready', () => {
      this.setupWhenProducerReady();
    });
    this.consumer = new Consumer(new Client(process.env.KAFKA_HOST),
      [{ topic: 'METADATA_EXTRACTED' }],
      { groupId: 'fulltext-service-consumer' + Math.random().toString(36).substring(7) }
    );
  }

  setupWhenProducerReady() {
    this.producer.on('error', (err) => {
      logger.error('error', err);
    });
    this.consumer.on('message', (message) => {
      this.handleIncoming(message)
        .then(() => logger.info('Handled METADATA_EXTRACTED message.'))
        .catch((err) => logger.error('Error handling METADATA_EXTRACTED message', err));
    });
  }

  async handleIncoming(message: Message) {
    const obj = JSON.parse(message.value);
    return this.elasticSearch.addDocumentToUser(obj.userId, obj.fileId, obj.metadata);
  }
}
