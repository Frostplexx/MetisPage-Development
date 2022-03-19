const topURL = "http://8184-2a02-810d-d40-65a0-d180-1fe0-37b0-dac8.ngrok.io"
export let code = "";

export async function playMusic(_url) {
	const postURL = topURL + "/api/music/player/create"
	//generate random id
	const id = Math.floor(Math.random() * 1000000)
	const body = {
		"pairing_code": code,
		"songs": [
			{
				"song_id": id,
				"url": _url,
				"state": "playing",
				"volume": "1",
				"start_time": "0",
			}
		]
	}
	const response = await runRequest("POST", body, postURL)
	return {
		id: id,
		status: response.status
	};
}

//pause music
export async function pauseMusic(songid) {
	const postURL = topURL + "/api/music/update/" + songid
	const body = {
		"pairing_code": code,
		"song": {
			"song_id": songid,
			"state": "paused",
		}
	}
	const response = await runRequest("PUT", body, postURL)
	console.log(response)
	return response.status
}

export async function unpauseMusic(songid) {
	const postURL = topURL + "/api/music/update/" + songid
	const body = {
		"pairing_code": code,
		"song": {
			"song_id": songid,
			"state": "playing",
		}
	}
	const response = await runRequest("PUT", body, postURL)
	console.log(response)
	return response.status
}


//check if token is valid
export async function authenticate(token) {
	const __url = topURL + "/api/session/pair";
	document.getElementById("btn-spinner").style.display = "inline-block";
	const body = {
		"pairing_code": token,
	}
	const response = await runRequest("POST", body, __url);
	return response.status
}

export function setToken(token) {
	code = token
}

function runRequest(type, data, url) {
	return new Promise(function (resolve, reject) {
		const xhr = new XMLHttpRequest()
		xhr.open(type, url)
		xhr.setRequestHeader("Content-Type", "application/json")
		xhr.send(JSON.stringify(data))
		xhr.onload = function () {
			resolve(JSON.parse(xhr.response))
		}
		xhr.onerror = function () {
			reject(xhr.statusText)
		}
	})
}



export async function getVideoTitle(url){
	url.split("=");
	let id = url.split("=")[1];
	let res = await runRequest("POST", null, "https://noembed.com/embed?url=https://www.youtube.com/watch?v=" + id);
	return res.title;
}