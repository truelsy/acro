/**
 * Created by mega on 15. 9. 8.
 */

var mongoose = require('mongoose');

mongoose.connect('mongodb://192.168.1.201:27017/test');

mongoose.connection.on('error', console.error.bind(console, 'mongodb connection error:'));
mongoose.connection.once('open', function(){
    log.info('mongodb connection ok');
});

var itemSchema = mongoose.Schema({
   user_seq: Number,
   reg_date: {type: Date, degault: Date.now}
});

exports.items = mongoose.model('items', itemSchema);