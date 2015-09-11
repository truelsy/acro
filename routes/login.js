/**
 * Created by mega on 15. 9. 7.
 */

/*global mc */

var express = require('express');
var router = express.Router();
var util = require('util');
var sendPacket = require('../lib/sendPacket');
var ack = require('../lib/enum').ack;

var loginFromDatabase = function(socialid, res) {
    var loginQuery = util.format('call sp_info_login(\'%s\');', socialid);

    // Memcached에서　못　찾은　경우　Database에서　조회
    db.execute(loginQuery, function(err, result) {
        var dbResult = result[0][0];
        if (err || 0 >= dbResult.user_seq) {
            sendPacket.Send(res, ack.ERROR);
            return;
        }

        // Database에서　조회　성공．（결과　전송）
        log.info("GetData From Database. socialid(%s)", socialid);
        sendPacket.Send(res, ack.OK, {user_info: dbResult});

        // Memcached에　저장
        mc.set(socialid, dbResult, function(err) {
            if (err) {
                log.error("Memcached Set Failed.. socialid(%s)", socialid);
            }
        });
    });
};


router.post('/', function(req, res) {
    var socialid = req.body['socialid'];

    if (undefined == socialid || 0 >= socialid.length) {
        log.error("socialid is null.");
        sendPacket.Send(res, ack.ERROR);
        return;
    }

    mc.get(socialid, function(err, mcResult) {
        if (undefined == mcResult) {
            loginFromDatabase(socialid, res);
            return;
        }

        // Memcached에서　조회　성공．（결과　전송)
        log.info("GetData From Memcached. socialid(%s)", socialid);
        sendPacket.Send(res, ack.OK, {user_info: mcResult});
    });
});

module.exports = router;