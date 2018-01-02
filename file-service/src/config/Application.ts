import { Inject, Service } from "typedi";
import { createConnection } from "typeorm";
import { KoaServerImpl } from "../services/KoaServerImpl";

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