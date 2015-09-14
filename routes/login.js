/**
 * Created by mega on 15. 9. 7.
 */

/*global mc */

var express = require('express');
var router = express.Router();
var util = require('util');
var sendPacket = require('../lib/sendPacket');
var ack = require('../lib/enum').ack;
var async = require('async');

var loginFromDatabase = function (socialid, res) {
	async.waterfall([
			function (callback) {
				var loginQuery = util.format('call sp_info_login(\'%s\');', socialid);
				db.execute(loginQuery, function (err, result) {
					callback(err, result);
				});
			},
			function (result, callback) {
				var dbResult = result[0][0];
				if (0 >= dbResult.user_seq) {
					sendPacket.Send(res, ack.ERROR, 'Invalid UserSeq');
					return;
				}

				// Database에서　조회　성공．（결과　전송）
				log.info("GetData From Database. socialid(%s)", socialid);
				sendPacket.Send(res, ack.OK, {user_info: dbResult});

				callback(null, dbResult);
			}
		],

		// Memcached에 유저 정보 저장
		function (err, dbResult) {
			if (err) {
				sendPacket.Send(res, ack.ERROR, err.message);
				return;
			}

			mc.set(socialid, dbResult, function (err) {
				if (err) {
					log.error("Memcached Set Failed.. socialid(%s)", socialid);
					return;
				}
				log.debug("Memcached Set OK! socialid(%s) userseq(%d)", socialid, dbResult.user_seq);
			});
		});
};


router.post('/', function (req, res) {
	var socialid = req.body.socialid;

	if (!socialid || !socialid.length) {
		sendPacket.Send(res, ack.ERROR, 'socialid empty');
		return;
	}

	mc.get(socialid, function (err, mcResult) {
		if (!mcResult) {
			loginFromDatabase(socialid, res);
			return;
		}

		// Memcached에서　조회　성공．（결과　전송)
		log.info("GetData From Memcached. socialid(%s)", socialid);
		sendPacket.Send(res, ack.OK, {user_info: mcResult});
	});
});

module.exports = router;