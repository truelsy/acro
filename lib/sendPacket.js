/**
 * Created by mega on 15. 9. 10.
 */

/*global loge */

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

	if (jsonValue instanceof Error) {
		sendValue['err_message'] = jsonValue.message;
	}

	response.json(sendValue);
};

exports.Send = send;