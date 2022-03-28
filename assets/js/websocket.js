import { updatePlayer } from "./music.js";

export let code = "";

//------- setting up ping-pong mechanism --------//
var connection = new WebSocket('ws://8.tcp.ngrok.io:10683');
var tm;
function ping() {
	connection.send(JSON.stringify({
		"type": "__ping__"
	}));
	tm = setTimeout(function () {
		/// ---connection closed ///
		console.error('connection closed');
		document.getElementById("connection-status").innerHTML = '<em class="fas fa-unlink"></em> Disconnected'
	}, 5000);
}

function pong() {
	clearTimeout(tm);
}
connection.onopen = function () {
	setInterval(ping, 30000);
}



//------- websocket functions --------//


// authenticate
export async function authenticate(token) {
	console.log(token)
	console.log('authenticating')
	let response = await makeRequest({
		"type": "authenticate",
		"token": token
	})
	return response.status;
}

export function setToken(token) {
	code = token
}

export async function playMusic(songs) {
	let vol = document.getElementById("volume").value;
	return makeRequest({
		"type": "playerCreate",
		"token": code,
		"data": {
			"songs": songs,
			"volume": vol
		}
	});
}

export async function pauseMusic() {
	return makeRequest({
		"type": "playerUpdate",
		"token": code,
		"data": {
			"state": "paused"
		}
	});
}

export async function unpauseMusic() {
	return makeRequest({
		"type": "playerUpdate",
		"token": code,
		"data": {
			"state": "playing"
		}
	});
}

export async function skipMusic() {
	return makeRequest({
		"type": "skipPlayer",
		"token": code
	});
}

export async function changeVol(vol) {
	return makeRequest({
		"type": "playerUpdate",
		"token": code,
		"data": {
			"volume": vol
		}
	});
}


export async function getPlayerState(tkn) {
	return makeRequest({
		"type": "getPlayerState",
		"token": tkn,
	});
}

// ----------------------------------------// 

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
				} else if(msg == '__pong__') {
					document.getElementById("connection-status").innerHTML = '<em class="fas fa-link"></em> Connected'
					pong();
				}
			}
		} catch (error) {
			reject(error);
		}
	});
}


async function checkresponse(msg){
	let type = JSON.parse(msg).type;
	switch (type) {
		case "songChange":
			const data = JSON.parse(msg).data;
			updatePlayer(data.icon, data.title, data.volume, data.state, data.url);
			break;
		default:
			break;
	}
}