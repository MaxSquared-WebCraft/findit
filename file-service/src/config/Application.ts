import { Inject, Service } from "typedi";
import { KoaServerImpl } from "./KoaServerImpl";
import { createConnection } from "typeorm";

export interface IServer {
  start: (port: number, message?: string) => void
}

@Service()
export class Application {

  @Inject(KoaServerImpl)
  server: IServer;

  async start() {
    await createConnection();
    this.server.start(8080);
  }
}