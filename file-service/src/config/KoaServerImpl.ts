import { Service, Token } from "typedi";
import { IServer } from "./Application";
import { createKoaServer } from "routing-controllers";

export const KoaServerImpl = new Token<IServer>();

@Service(KoaServerImpl)
export class KoaImpl implements IServer {

  private instance: any;

  constructor() {
    this.instance = createKoaServer({
      controllers: [process.cwd() + "/build/controllers/*.js"]
    });
  }

  start(port: number, message?: string) {
    this.instance.listen(port, () => message || 'server started at port ' + port)
  };
}
