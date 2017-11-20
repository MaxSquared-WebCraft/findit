import 'reflect-metadata'
import { createKoaServer } from 'routing-controllers';
import { SampleController } from './controllers/sampleController';

const app = createKoaServer({
  controllers: [SampleController]
});

app.listen(3000);