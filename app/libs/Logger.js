const winston = require('winston');
const { format } = winston;
const { combine, timestamp, label, printf } = format;
const moment = require('moment');
const tsFormat = () => moment().format('YYYY-MM-DD hh:mm:ss').trim();

const appLoggerFormat = printf(({ level, message, label, timestamp }) => {
  return `${tsFormat()} [${label}] ${level}: ${message}`;
});

const loggerContainer = new winston.Container();

loggerContainer.add('accessLogger', {
  format: combine(
    label({ label:  String(process.env.NODE_ENV).toUpperCase()}),
    timestamp(),
    appLoggerFormat
  ),
  transports: [
    new winston.transports.File({ filename: './logs/access.log' })
  ]
});

loggerContainer.add('logger', {
    //Customize format of log
    format: combine(
        label({ label:  String(process.env.NODE_ENV).toUpperCase()}),
        timestamp(),
        appLoggerFormat
    ),
    //Set logging types
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: './logs/app.log' })
    ]
});

const accessLogger = loggerContainer.get('accessLogger');
const logger = loggerContainer.get('logger');

accessLogger.stream = {
    write(message){
        //Remove new line of message
        accessLogger.info(message.substring(0,message.lastIndexOf('\n')));
    }
};

exports.accessLogger = accessLogger
exports.logger = logger
