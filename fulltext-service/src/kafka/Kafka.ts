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
    logger.info('Setting up kafka');
    this.consumer = new Consumer(new Client(process.env.KAFKA_HOST),
      [{ topic: 'METADATA_EXTRACTED' }],
    );
    this.consumer.on('message', (message) => {
      this.handleIncoming(message)
        .then(() => logger.info('Handled METADATA_EXTRACTED message.'))
        .catch((err) => logger.error('Error handling METADATA_EXTRACTED message', err));
    });
  }

  setupWhenProducerReady() {
    this.producer.on('error', (err) => {
      logger.error('error', err);
    });

  }

  async handleIncoming(message: Message) {
    const obj = JSON.parse(message.value);
    logger.info('Message:', obj);
    return this.elasticSearch.addDocumentToUser(
      obj.userId || 'nix' + Math.random(),
      obj.fileUuid || 'nix' + Math.random(),
      {
        title: obj.originalname || '',
        content: obj.metadata || '',
        location: obj.location || '',
      }
    );
  }
}
