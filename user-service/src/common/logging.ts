import * as winston from 'winston';

export const logger = new winston.Logger();

process.on('unhandledRejection', (reason, p)  =>{
    logger.warn('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});
