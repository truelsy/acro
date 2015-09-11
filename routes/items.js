/**
 * Created by mega on 15. 9. 10.
 */

var express = require('express');
var router = express.Router();
var mongo = require('../lib/mongodb');
var sendPacket = require('../lib/sendPacket');
var ack = require('../lib/enum').ack;

//router.post('/insert', function(req, res) {
//    var item = new mongo.items({user_seq: req.body.user_seq});
//    item.save(function(err, item) {
//       if (err) {
//           log.error('item save failed.');
//           res.send('-1');
//       }
//       else {
//           res.send('1');
//       }
//    });
//});

router.post('/insert', function(req, res) {
    var user_seq = req.body['user_seq'];
    var insJson = {user_seq: user_seq};
    mongo.Insert('items', insJson, function(err, result) {
        if (err) {
            log.error('oops. err : ' + err.message);
            sendPacket.Send(res, ack.ERROR);
            return;
        }

        var resJson = {item_info: result.ops};
        sendPacket.Send(res, ack.OK, resJson);
    });
});


router.post('/select', function(req, res) {
    var user_seq = req.body['user_seq'];
    var condJson = {user_seq: user_seq};
    mongo.Select('items', condJson, function(err, result) {
        if (err) {
            log.error('oops. err : ' + err.message);
            sendPacket.Send(res, ack.ERROR);
            return;
        }

        sendPacket.Send(res, ack.OK, result);
    });
});

module.exports = router;