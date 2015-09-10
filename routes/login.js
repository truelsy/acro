/**
 * Created by mega on 15. 9. 7.
 */

var express = require('express');
var router = express.Router();
var util = require('util');

/* GET users listing. */
router.post('/', function(req, res) {

    var socialid = req.body.socialid;

    if (undefined == socialid || 0 >= socialid.length) {
        log.error("socialid is null.");
        res.send('-1');
        return;
    }

    mc.get(socialid, function(err, value) {
        if (undefined == value) {
            var loginQuery = util.format('call sp_info_login(\'%s\');', socialid);

            // Memcached에서　못　찾은　경우　Database에서　조회
            db.execute(loginQuery, function(err, result, field) {
                if (err) {
                    res.send('-1');
                    return;
                }

                // Database에서　조회　성공．（결과　전송）
                log.info("GetData From Database. socialid(%s)", socialid);
                res.send(result[0][0]);
                logg.info(result[0][0]);

                // Memcached에　저장
                mc.set(socialid, result[0][0], function(err) {
                   if (err) {
                       log.error("Memcached Set Failed.. socialid(%s)", socialid);
                   }
                });
            });
        }
        else {
            // Memcached에서　조회　성공．（결과　전송)
            log.info("GetData From Memcached. socialid(%s)", socialid);
            res.send(value);
            logg.info(value);
        }
    });
});

module.exports = router;