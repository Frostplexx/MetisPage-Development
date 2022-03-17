const topURL = "http://0c3e-2a02-810d-d40-65a0-d180-1fe0-37b0-dac8.ngrok.io"
var code = "12345678"
async function authenticate() {
	const __url = topURL + "/api/session/pair";
	let password = document.getElementById("sessionInput").value;
	let loginwindow = document.getElementById("login");
	let dashboardwindow = document.getElementById("dashboard");
	document.getElementById("btn-spinner").style.display = "inline-block";
	const body = {
		"pairing_code": password,
	}
	const response = await runRequest("POST", body, __url);
	console.log(response);
	if (response.status) {
		loginwindow.style.display = "none";
		document.getElementById("btn-spinner").style.display = "none";
		dashboardwindow.style.display = "inline-block";
		code = password
	} else {
		document.getElementById("btn-spinner").style.display = "none";
		alert("Wrong Session ID");
	}
}

function playsong(_url){
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

function runRequest(type, data, url) {
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

