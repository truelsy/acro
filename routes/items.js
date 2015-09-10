/**
 * Created by mega on 15. 9. 10.
 */

var express = require('express');
var router = express.Router();


router.post('/insert', function(req, res) {
    var item = new mongo.items({user_seq: req.body.user_seq});
    item.save(function(err, item) {
       if (err) {
           log.error('item save failed.');
           res.send('-1');
       }
       else {
           res.send('1');
       }
    });
});

module.exports = router;