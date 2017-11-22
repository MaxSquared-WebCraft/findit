import 'reflect-metadata'
import { createKoaServer } from 'routing-controllers';

const app = createKoaServer({
  controllers: [__dirname + "/controllers/*.js"]
});

app.listen(3000);