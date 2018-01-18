import {Body, Controller, Get, Param, Post, QueryParam} from 'routing-controllers';
import {Inject} from 'typedi';
import {logger} from '../common/logging';
import {ElasticSearchService} from '../services/ElasticSearchService';

@Controller('/test')
export class DocumentController {

    @Inject()
    documentService: ElasticSearchService;

    constructor() {
        logger.info('DocumentController', 'DocController initialized');
    }

    @Post('/:userId')
    async addDocumentToUser(@Param('userId') id: string, @Body() body: any): Promise<any> {
        logger.info('userId = ' + id + ' body = ', body);
        return this.documentService.addDocumentToUser(id, body);
    }

    @Get('/')
    async getSuggestionsForUser(@QueryParam('user') id: string,
                                @QueryParam('text') text: string): Promise<any> {
        return this.documentService.getSuggestions(id, text);
    }
}
