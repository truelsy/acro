/**
 * Created by mega on 15. 9. 8.
 */

/*global process */

//var mongoose = require('mongoose');
//
//mongoose.connect('mongodb://192.168.1.201:27017/test');
//
//mongoose.connection.on('error', console.error.bind(console, 'mongodb connection error:'));
//mongoose.connection.once('open', function(){
//    log.info('mongodb connection ok');
//});
//
//var itemSchema = mongoose.Schema({
//   user_seq: Number,
//   reg_date: {type: Date, degault: Date.now}
//});
//
//exports.items = mongoose.model('items', itemSchema);


var MongoClient = require('mongodb').MongoClient;
var AutoIncrement = require("mongodb-autoincrement");
var async = require('async');


var URL = 'mongodb://192.168.1.201:27017/test';
var DB;

MongoClient.connect(URL, function (err, db) {
	if (err) {
		log.error('MongoDB Connect ERROR: ' + err.message);
		process.exit(1);
		return;
	}

	log.info('MongoDB Connect OK!');
	DB = db;
});


var insert = function (collectionName, json, callback) {

	async.waterfall([
			function (callback) {
				AutoIncrement.getNextSequence(Db, collectionName, function (err, autoInc) {
					callback(err, autoInc);
				});
			},
			function (autoInc, callback) {
				var insJson = {_id: autoInc};
				for (var attr in json) {
					insJson[attr] = json[attr];
				}
				callback(null, insJson, callback);
			}
		],

		function (err, insJson) {
			if (err) {
				callback(err);
				return;
			}
			DB.collection(collectionName).insert(insJson, function (err, result) {
				callback(err, result);
			});
		});
};

var select = function (collectionName, cond, callback) {
	DB.collection(collectionName).find(cond).toArray(function (err, result) {
		if (err) {
			callback(err);
			return;
		}
		callback(err, result);
	});
};

exports.Insert = insert;
exports.Select = select;