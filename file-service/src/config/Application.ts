import { Inject, Service } from "typedi";
import { KoaServerImpl } from "../services/KoaServerImpl";
import { FileUploadedHandler } from "../services/FileEventHandler";
import { ProducerFactory } from "../events/ProducerFactory";

export interface IServer {
  start: (port: number, message?: string) => void;
}

@Service()
export class Application {

  @Inject(KoaServerImpl)
  server: IServer;

  constructor(
    private producerFactory: ProducerFactory,
    private fileEventHandler: FileUploadedHandler
  ) {
    this.fileEventHandler.registerHandlers();
  }

  async start() {
    await this.producerFactory.initProducer();
    this.server.start(Number(process.env.HTTP_HOST));
  }
}