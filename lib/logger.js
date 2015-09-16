/**
 * Created by mega on 15. 9. 7.
 */

var winston = require('winston');
var moment = require('moment');

function getTimeStamp() {
	return moment().format('YYYY-MM-DD HH:mm:ss');
};

var myCustomLevels = {
	levels: {
		info: 0,
		debug: 1,
		error: 2
	},
	colors: {
		info: 'green',
		debug: 'blue',
		error: 'red'
	}
};

var logger = new winston.Logger({
	transports: [
		new (winston.transports.Console)({
			level: "debug",
			colorize: true,
			timestamp: getTimeStamp
		}),
		new (winston.transports.DailyRotateFile)({
			filename: "logs/debug",
			level: "debug",
			colorize: false,
			maxsize: 1024 * 1024,
			maxFiles: 5,
			timestamp: getTimeStamp,
			datePattern: '.yyyyMMddHH.log',
			json: false
		})
	]
//	,exceptionHandlers: [
//		new (winston.transports.DailyRotateFile)({
//			filename: 'logs/exception',
//			level: "debug",
//			colorize: true,
//			maxsize: 1024 * 1024,
//			maxFiles: 5,
//			timestamp: getTimeStamp,
//			datePattern: '.yyyyMMddHH.log',
//			json: false
//		})
//	]
	,setLevels: myCustomLevels.levels
	,exitOnError: false
});

var loggerException = new winston.Logger({
	transports: [
		new (winston.transports.Console)({
			level: "error",
			colorize: true,
			timestamp: getTimeStamp
		}),
		new (winston.transports.DailyRotateFile)({
			filename: "logs/exception",
			level: "error",
			colorize: false,
			maxsize: 1024 * 1024,
			maxFiles: 5,
			timestamp: getTimeStamp,
			datePattern: '.yyyyMMddHH.log',
			json: false
		})
	]

	,setLevels: myCustomLevels.levels
	,exitOnError: false
});

exports.log = logger;
exports.loge = loggerException;





//module.exports = function (filename) {
//	var logger = new (winston.Logger)({
//		transports: [
//			new (winston.transports.Console)({
//				level: "info",
//				colorize: true,
//				timestamp: getTimeStamp
//			}),
//
//			new (winston.transports.DailyRotateFile)({
//				filename: filename,
//				level: "info",
//				colorize: false,
//				maxsize: 1024 * 1024,
//				maxFiles: 5,
//				timestamp: getTimeStamp,
//				datePattern: '.yyyyMMddHH.log',
//				json: false
//			})
//		]
//
////        ,exceptionHandlers: [
////           new (winston.transports.DailyRotateFile)({
////                filename: 'logs/exception',
////                level: "debug",
////                colorize: true,
////                maxsize: 1024 * 1024,
////                maxFiles: 5,
////                timestamp: getTimeStamp,
////                datePattern: '.yyyyMMddHH.log',
////                json: false
////            })
////        ]
//	});
//
////	logger.setLevels(winston.config.syslog.levels);
//	logger.setLevels(myCustomLevels.levels);
//	logger.exitOnError = false;
//	return logger;
//};
