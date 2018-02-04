import { Inject, Service } from 'typedi';
import { ElasticSearch } from '../config/ElasticSearch';
import { logger } from "../common/logging";

@Service()
export class ElasticSearchService {

  @Inject()
  elasticSearch: ElasticSearch;

  async createIndex(indexName: string) {
    const elastic = await this.elasticSearch.getElastic();
    return elastic.indices.create({
      index: indexName
    });
  }

  async deleteIndex(indexName: string) {
    const elastic = await this.elasticSearch.getElastic();
    return elastic.indices.delete({
      index: indexName
    });
  }

  async doesIndexExist(indexName: string) {
    const elastic = await this.elasticSearch.getElastic();
    return elastic.indices.exists({
      index: indexName
    });
  }

  async initMapping(mapping: any) {
    const elastic = await this.elasticSearch.getElastic();
    return elastic.indices.putMapping(mapping);
  }

  async addDocument(index: string, fileId: string, document: any) {
    logger.info('document: ', document);
    const elastic = await this.elasticSearch.getElastic();
    return elastic.index({
      index,
      type: 'document',
      body: {
        uuid: fileId,
        title: document.title,
        content: document.content,
        location: document.location,
      }
    });
  }

  async deleteDocument(index: string, fileId: string) {
    const elastic = await this.elasticSearch.getElastic();
    return elastic.index({
      index,
      type: 'document',
      body: {
        uuid: fileId
      }
    });
  }

  async getSuggestions(index: string, input: string) {
    const elastic = await this.elasticSearch.getElastic();
    return elastic.search({
      index,
      body: {
        query: {
          multi_match: {
            query: input,
            fields: ['title^2', 'content']
          }
        },
        highlight: {
          pre_tags: [
            '<span class="highlight">'
          ],
          post_tags: [
            '</span>'
          ],
          fields: {
            _all: {}
          }
        }
      }
    });
  }

  async addDocumentToUser(userId: string, fileId: string, document: any) {
    const indexExists: boolean = await this.doesIndexExist(userId);
    if (!indexExists) {
      await this.createIndex(userId);
    }

    return this.addDocument(userId, fileId, document);
  }

  async deleteDocumentFromUser(userId: string, fileId: string) {
    const indexExists: boolean = await this.doesIndexExist(userId);
    if (!indexExists) {
      await this.createIndex(userId);
    }

    return this.deleteDocument(userId, fileId);
  }
}
