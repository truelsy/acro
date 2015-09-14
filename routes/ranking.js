/**
 * Created by mega on 15. 9. 14.
 */

var express = require('express');
var router = express.Router();
var redis = require('../lib/redis');
var sendPacket = require('../lib/sendPacket');
var ack = require('../lib/enum').ack;

router.post('/insert', function(req, res) {
	var user_seq = req.body['user_seq'];
	var score = req.body['score'];

	if (!user_seq || !score) {
		sendPacket.Send(res, ack.ERROR, "INVALID Request.");
		return;
	}

	redis.zincrby('RankKey', score, user_seq, function(err, curScore) {
		if (err) {
			sendPacket.Send(res, ack.ERROR);
			return;
		}

		sendPacket.Send(res, ack.OK, {cur_score: curScore});
	});
});


router.post('/top10', function(req, res) {
	redis.zrevrange('RankKey', 0, 9, function(err, result) {
		if (err) {
			sendPacket.Send(res, ack.ERROR);
			return;
		}

		sendPacket.Send(res, ack.OK, {rank_info: result});
	});
});

module.exports = router;