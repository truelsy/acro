/**
 * Created by mega on 15. 9. 10.
 */

var send = function(response, ackValue, jsonValue) {
    if (typeof ackValue == "object") {
        ackValue = ackValue.value;
    }

    var sendValue = {ack: ackValue};

    for(var attr in jsonValue){
        sendValue[attr] = jsonValue[attr];
    }

    response.json(sendValue);
};

exports.Send = send;