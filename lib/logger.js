/**
 * Created by mega on 15. 9. 7.
 */

var winston = require('winston');
var moment = require('moment');

function getTimeStamp() {
    return moment().format('YYYY-MM-DD HH:mm:ss');
};

module.exports = function(filename) {
    var logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({
                level: "error",
                colorize: true,
                timestamp: getTimeStamp
            }),

            new (winston.transports.DailyRotateFile)({
                filename: filename,
                level: "info",
                colorize: true,
                maxsize: 1024 * 1024,
                maxFiles: 5,
                timestamp: getTimeStamp,
                datePattern: '.yyyyMMdd',
                json: true
            })
        ]

//        exceptionHandlers: [
//           new (winston.transports.DailyRotateFile)({
//                filename: 'Exception_' + config.file_logname,
//                level: "debug",
//                colorize: true,
//                maxsize: 1024 * 1024,
//                maxFiles: 5,
//                timestamp: getTimeStamp,
//                datePattern: '.yyyyMMdd',
//                json: false
//            })
//        ]
    });

    logger.setLevels(winston.config.syslog.levels);
    logger.exitOnError = false;
    return logger;
};
