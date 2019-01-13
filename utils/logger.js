const winston = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');
const logDir = `logs/`;
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const transport = new (winston.transports.DailyRotateFile)({
    filename   : '%DATE%.log',
    dirname    : logDir,
    datePattern: 'YYYY-MM-DD-HH',
    maxSize    : '20m'
});

const winstonLogger = new (winston.Logger)({
    transports: [
        transport
    ]
});

const logger = {
    info : (message) => {
        winstonLogger.info(message);
    },
    error: (error) => {
        winstonLogger.error(error);
    }
};

module.exports = logger;
