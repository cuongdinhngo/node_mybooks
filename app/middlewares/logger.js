require('winston-mongodb');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const moment = require('moment');
const tsFormat = () => moment().format('YYYY-MM-DD hh:mm:ss').trim();

const appLoggerFormat = printf(({ level, message, label, timestamp }) => {
  return `${tsFormat()} [${label}] ${level}: ${message}`;
});

logger = createLogger({
    //Customize format of log
    format: combine(
        label({ label:  String(process.env.NODE_ENV).toUpperCase()}),
        timestamp(),
        appLoggerFormat
    ),
    //Set logging types
    transports: [
        new transports.Console(),
        new transports.File({ filename: './logs/app.log' })
    ]
});

//Set stream for morgan logger
logger.stream = {
    write(message){
        //Remove new line of message
        logger.info(message.substring(0,message.lastIndexOf('\n')));
    }
};

module.exports = logger;
