/**
 * Created by mega on 15. 9. 10.
 */

var send = function (response, ackValue, jsonValue) {
	if (typeof ackValue == "object") {
		ackValue = ackValue.value;
	}

	var sendValue = {ack: ackValue};

	if (typeof jsonValue == "object") {
		for (var attr in jsonValue) {
			sendValue[attr] = jsonValue[attr];
		}
	}
	else if (typeof jsonValue == "string") {
		var errMsg = jsonValue;
		sendValue.errMsg = errMsg;
		log.error('ErrorMessage (' + errMsg + ')');
	}

	//console.log("+++++ " + __filename);
	response.json(sendValue);
};

exports.Send = send;