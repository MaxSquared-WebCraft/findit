import {Controller, Get, HeaderParam, QueryParam} from 'routing-controllers';
import {Inject} from 'typedi';
import {logger} from '../common/logging';
import {ElasticSearchService} from '../services/ElasticSearchService';

@Controller('/search')
export class DocumentController {

    @Inject()
    documentService: ElasticSearchService;

    constructor() {
        logger.info('DocumentController', 'DocController initialized');
    }

    @Get('/')
    async getSuggestionsForUser(@HeaderParam('x-user') userId: string,
                                @QueryParam('text') text: string): Promise<any> {
        return this.documentService.getSuggestions(userId, text);
    }
}
