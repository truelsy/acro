/**
 * Created by mega on 15. 9. 10.
 */

var Enum = require('enum');

var ack = new Enum({
    ACK_OK: 1,
    ACK_ERROR: -1
});

exports.ack = ack;