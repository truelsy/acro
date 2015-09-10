/**
 * Created by mega on 15. 9. 10.
 */

var send = function(response, ackValue, jsonValue) {
    if (typeof ackValue == "object") {
        ackValue = ackValue.value;
    }

    var sendValue = {ack: ackValue};

    for(var key in jsonValue){
        sendValue[key] = jsonValue[key];
    }

    response.json(sendValue);
};

exports.Send = send;