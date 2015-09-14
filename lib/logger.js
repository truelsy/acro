/**
 * Created by mega on 15. 9. 7.
 */

var winston = require('winston');
var moment = require('moment');

function getTimeStamp() {
	return moment().format('YYYY-MM-DD HH:mm:ss');
};

module.exports = function (filename) {
	var logger = new (winston.Logger)({
		transports: [
			new (winston.transports.Console)({
				level: "error",
				colorize: true,
				timestamp: getTimeStamp
			}),

			new (winston.transports.DailyRotateFile)({
				filename: filename,
				level: "error",
				colorize: true,
				maxsize: 1024 * 1024,
				maxFiles: 5,
				timestamp: getTimeStamp,
				datePattern: '.yyyyMMddHH.log',
				json: false
			})
		]

//        ,exceptionHandlers: [
//           new (winston.transports.DailyRotateFile)({
//                filename: 'logs/exception',
//                level: "debug",
//                colorize: true,
//                maxsize: 1024 * 1024,
//                maxFiles: 5,
//                timestamp: getTimeStamp,
//                datePattern: '.yyyyMMddHH.log',
//                json: false
//            })
//        ]
	});

	logger.setLevels(winston.config.syslog.levels);
	logger.exitOnError = false;
	return logger;
};
