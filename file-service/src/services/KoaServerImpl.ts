import { Service, Token } from "typedi";
import { createKoaServer } from "routing-controllers";
import { IServer } from "../config/Application";

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
    this.instance.listen(port);
    console.log(message || 'Server listening at port ' + port)
  };
}
