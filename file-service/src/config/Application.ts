import { Inject, Service } from "typedi";
import { KoaServerImpl } from "../services/KoaServerImpl";
import { FileUploadedHandler } from "../services/FileEventHandler";
import { ProducerFactory } from "../events/ProducerFactory";

export interface IServer {
  start: (port: number, message?: string) => void;
}

export interface ILogger {
  info: (msg: string, meta?: any) => void;
  warn: (msg: string, meta?: any) => void;
  error: (msg: string, meta?: any) => void;
}

@Service()
export class Application {

  constructor(
    @Inject(KoaServerImpl) private readonly server: IServer,
    private readonly producerFactory: ProducerFactory,
    private readonly fileEventHandler: FileUploadedHandler
  ) {
    this.fileEventHandler.registerHandlers();
  }

  public start = async () => {
    await this.producerFactory.initProducer();
    this.server.start(Number(process.env.HTTP_HOST));
  }
}
