import { Inject, Service } from "typedi";
import { KoaServerImpl } from "../services/KoaServerImpl";
import * as config from 'config'
import { ClientFactory } from "../events/ClientFactory";
import { FileUploadedHandler } from "../services/FileEventHandler";

export interface IServer {
  start: (port: number, message?: string) => void
}

@Service()
export class Application {

  @Inject(KoaServerImpl)
  server: IServer;

  constructor(
    private clientFactory: ClientFactory,
    private fileEventHandler: FileUploadedHandler
  ) {
    this.fileEventHandler.registerHandlers();
  }

  async start() {
    this.server.start(config.get("port"));
  }
}