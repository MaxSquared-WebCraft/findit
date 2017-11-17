import * as config from 'config';
import {Service} from 'typedi';
import * as elasticsearch from 'elasticsearch';
import {logger} from '../common/logging';

@Service()
export class ElasticSearch {
    private elasticClient: elasticsearch.Client;
    private url: string = config.get('elasticsearch.url').toString();
    private logLevel: string = config.get('elasticsearch.log').toString();

    async getElastic() {
        if (!this.elasticClient) {
            this.elasticClient = await new elasticsearch.Client({
                host: this.url,
                log: this.logLevel
            });
        }
        return this.elasticClient;
    }

    async health() {
        this.elasticClient.ping({
            // ping usually has a 3000ms timeout
            requestTimeout: 1000
        }, (error) => {
            if (error) {
                logger.log('ElasticSearch', 'elasticsearch cluster is down!');
                return false;
            } else {
                logger.log('ElasticSearch', 'All is well');
                return true;
            }
        });
    }
}
