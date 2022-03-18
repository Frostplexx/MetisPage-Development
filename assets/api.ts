const topURL = "http://8184-2a02-810d-d40-65a0-d180-1fe0-37b0-dac8.ngrok.io"
export let code = "";


export function playsong(_url: string){
	const postURL = topURL + "/api/music/play"
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
	runRequest("POST", body, postURL)
}

function runRequest(type: string, data: any, url: string): Promise<APIResponse> {
	return new Promise(function (resolve, reject) {
		const xhr = new XMLHttpRequest()
		xhr.open(type, url)
		xhr.setRequestHeader("Content-Type", "application/json")
		xhr.send(JSON.stringify(data))
		xhr.onload = function()  {
			resolve(JSON.parse(xhr.response))
		}
		xhr.onerror = function() {
			reject(xhr.statusText)
		}
	})
}

//check if token is valid
export async function authenticate(token: string) {
	const __url = topURL + "/api/session/pair";
	document.getElementById("btn-spinner")!.style.display = "inline-block";
	const body = {
		"pairing_code": token,
	}
	const response = await runRequest("POST", body, __url) as APIResponse;
	return response.status
}

export function setToken(token: string) {
	code = token
}


interface APIResponse {
	"status": boolean, // true if successful
	"message": string, // message to display
	"data": any | null // data to return
}
