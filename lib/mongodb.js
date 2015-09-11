/**
 * Created by mega on 15. 9. 8.
 */

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

var url = 'mongodb://192.168.1.201:27017/test';

var Db;

MongoClient.connect(url, function(err, db) {
    if (err) {
        log.error('MongoDB connect error: ' + err);
        return;
    }

    log.info('MongoDB connect OK!');
    Db = db;
})


var insert = function(collectionName, json, callback) {
    Db.collection(collectionName).insert(json, function(err, result) {
       callback(err, result);
    });
};

var select = function(collectionName, cond, callback) {
    Db.collection(collectionName).find(cond).toArray(function(err, result) {
        callback(err, result);
    }) ;
};

exports.Insert = insert;
exports.Select = select;