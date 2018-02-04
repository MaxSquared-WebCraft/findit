import { Controller, Get, HeaderParam, QueryParam } from 'routing-controllers';
import { logger } from '../common/logging';
import { ElasticSearchService } from '../services/ElasticSearchService';

@Controller('/search')
export class DocumentController {

  constructor(private readonly documentService: ElasticSearchService) {
    logger.info('DocumentController', 'DocController initialized');
  }

  @Get('/')
  async getSuggestionsForUser(@HeaderParam('x-user') userId: string,
                              @QueryParam('text') text: string): Promise<any> {
    logger.info('user', userId);
    logger.info('text', text);
    return this.documentService.getSuggestions(userId, text);
  }
}
