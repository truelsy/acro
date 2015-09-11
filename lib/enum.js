/**
 * Created by mega on 15. 9. 10.
 */

var Enum = require('enum');

var ack = new Enum({
    OK: 1,
    ERROR: -1
});

exports.ack = ack;