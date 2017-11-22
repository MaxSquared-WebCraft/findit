import { Get, JsonController } from 'routing-controllers';

@JsonController()
export class SampleController {

  @Get('/test')
  getTest() {
    return { test: 'test' };
  }
}