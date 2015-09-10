/**
 * Created by mega on 15. 9. 10.
 */

var send = function(response, ackValue, jsonValue) {
    var sendValue = {ack: ackValue.value};

    for(var key in jsonValue){
        sendValue[key] = jsonValue[key];
    }

    response.send(sendValue);
};

exports.Send = send;