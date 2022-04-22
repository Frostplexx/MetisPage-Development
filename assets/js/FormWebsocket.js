const serverURL = "wss://preview.webhook.metisbot.xyz/ws";
console.log("Connecting to " + serverURL);
var connection = new WebSocket(serverURL);
var tm;
function ping() {
	connection.send(JSON.stringify({
		"type": "__ping__"
	}));
	tm = setTimeout(function () {
		/// ---connection closed ///
		console.error('connection closed');
	}, 5000);
}

function pong() {
	clearTimeout(tm);
}
connection.onopen = function () {
	setInterval(ping, 30000);
}

export async function wsSendForms(formData){
	return makeRequest({
		"type": "newForm",
		"data": formData
	});
}


// general request function
async function makeRequest(body) {
	return new Promise(function (resolve, reject) {
		try {
			connection.send(JSON.stringify(body));
			connection.onmessage = function (evt) {
				var msg = evt.data;
				if (msg !== '__pong__') {
					checkresponse(msg);
					resolve(JSON.parse(msg));
				} else if (msg == '__pong__') {
					pong();
				}
			}
		} catch (error) {
			reject(error);
		}
	});
}


async function checkresponse(msg) {
	let type = JSON.parse(msg).type;
	let data = ""; 
	switch (type) {
		case "newFormResponse":
			data = JSON.parse(msg).data;
			afterSendMessage(data);
			break;
		default:
			break;
	}
}