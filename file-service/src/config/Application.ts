import { Inject, Service } from "typedi";
import { KoaServerImpl } from "./KoaServerImpl";
import { MongoDataSourceImpl } from "./MongoDataSourceImpl";

export interface IServer {
  start: (port: number, message?: string) => void
}

export interface IDataSource {
  setup: () => void
}

@Service()
export class Application {

  @Inject(KoaServerImpl)
  server: IServer;

  @Inject(MongoDataSourceImpl)
  dataSource: IDataSource;

  async start() {
    this.dataSource.setup();
    this.server.start(8080);
  }
}