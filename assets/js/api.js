const topURL = "http://d8ba-2a02-810d-d40-65a0-d0d-e32a-c8ba-6e4.ngrok.io"
export let code = "";

export async function playMusic(songs) {
	let vol = document.getElementById("volume").value;
	const postURL = topURL + "/api/player/create"
	//generate random id
	const body = {
		"pairing_code": code,
		"songs": songs,
		"volume": vol

	}
	return runRequest("POST", body, postURL)
}

//pause music
export async function pauseMusic() {
	const postURL = topURL + "/api/player/update/" 
	const body = {
		"pairing_code": code,
		"state": "paused",
	}
	const response = await runRequest("PUT", body, postURL)
	console.log(response)
	return response.status
}

export async function unpauseMusic() {
	const postURL = topURL + "/api/player/update/"
	const body = {
		"pairing_code": code,
		"state": "playing",
	}
	const response = await runRequest("PUT", body, postURL)
	console.log(response)
	return response.status
}

export async function skipMusic(){
	const postURL = topURL + "/api/player/skip/"
	const body = {
		"pairing_code": code,
	}
	return runRequest("PUT", body, postURL)
}

export async function changeVol(volume) {
	const postURL = topURL + "/api/player/update/"
	const body = {
		"pairing_code": code,
		"volume": (volume)
	}
	return runRequest("PUT", body, postURL)
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

export async function getPlayerState(tkn) {
	const __url = topURL + "/api/player/get/" + tkn;
	const body = {}
	console.log("Token: " + tkn)
	return runRequest("GET", body, __url);
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