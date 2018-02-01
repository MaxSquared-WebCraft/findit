import { Inject, Service, Token } from "typedi";
import { createKoaServer } from "routing-controllers";
import { IServer } from "../config/Application";
import { ILogger } from "../../build/config/Application";
import { WinstonLoggerImpl } from "../common/WinstonLoggerImpl";

export const KoaServerImpl = new Token<IServer>();

@Service(KoaServerImpl)
export class KoaImpl implements IServer {

  @Inject(WinstonLoggerImpl)
  private readonly logger: ILogger;

  private instance: any;

  constructor() {
    this.instance = createKoaServer({
      controllers: [process.cwd() + "/build/controllers/*.js"]
    });
  }

  start(port: number, message?: string) {
    this.instance.listen(port);
    this.logger.info(message || `Server listening on port ${port}`);
  }
}
