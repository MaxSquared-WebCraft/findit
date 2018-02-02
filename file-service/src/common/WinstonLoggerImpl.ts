import { Service, Token } from "typedi";
import { ILogger } from "../config/Application";
import { LoggerInstance, createLogger, format, transports } from "winston";

export const WinstonLoggerImpl = new Token<WinstonLogger>();

const fn = (myNumber: number): string => {
  return ("0" + myNumber).slice(-2);
};

const formatDate = (date: Date) => {
  return `${fn(date.getDate())}.${fn(date.getMonth() + 1)}`;
};

const formatTime = (date: Date) => {
  return `${fn(date.getHours())}:${fn(date.getMinutes())}:${fn(date.getSeconds())}:${fn(date.getMilliseconds())}`;
};

const myFormat = format.printf(({ timestamp, level, message }: any) => {
  const date = new Date(timestamp);
  return `[${formatDate(date)}] [${formatTime(date)}] [${level}]: ${message}`;
});

@Service(WinstonLoggerImpl)
export class WinstonLogger implements ILogger {

  private readonly logger: LoggerInstance;

  constructor() {

    this.logger = createLogger({
      level: "info",
      format: format.combine(
        format.timestamp(),
        format.splat(),
        myFormat,
      ),
      transports: [
        new transports.Console(),
      ]
    });

    this.registerUnhandled();
  }

  private registerUnhandled = () => {
    this.logger.info('Registering unhandled rejection handler...');
    process.on('unhandledRejection', (reason, p) => {
      this.logger.error(`Unhandled rejection at Promise ${p}, reason ${reason}`);
    });
  };

  public info = (msg: string, meta?: any) => {
    this.logger.info(msg, meta);
  };

  public warn = (msg: string, meta?: any) => {
    this.logger.warn(msg, meta);
  };

  public error = (msg: string, meta?: any) => {
    this.logger.error(msg, meta);
  };
}
