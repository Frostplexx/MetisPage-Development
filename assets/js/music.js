import { authenticate, setToken, playMusic, pauseMusic, unpauseMusic, skipMusic, changeVol } from "./api.js";


window.onload = async function () {
	let pswd = document.getElementById("sessionInput").value;
	console.log(pswd)
	if(pswd !== "") {
		let response = await authenticate(pswd);
		if (response) {
	
			let loginwindow = document.getElementById("login");
			let dashboardwindow = document.getElementById("dashboard");
			loginwindow.style.display = "none";
			loginwindow.style.opacity = "0";
			dashboardwindow.style.display = "inline-block";
			setToken(pswd);
		} else {
			document.getElementById("btn-spinner").style.display = "none";
			document.getElementById("sessionInput").value = "";
		}
	}
}





//authentication handling -- checks if token is valid
const loginButton = document.getElementById("submitbutton");
loginButton.addEventListener("click", login);
let currentSong = null;
async function login() {
	const password = document.getElementById("sessionInput").value;
	let loginwindow = document.getElementById("login");
	let dashboardwindow = document.getElementById("dashboard");
	let response = await authenticate(password);
	if (response) {
		loginwindow.style.display = "none";
		loginwindow.style.opacity = "0";
		document.getElementById("btn-spinner").style.display = "none";
		dashboardwindow.style.display = "inline-block";
		setToken(password);
	} else {
		document.getElementById("btn-spinner").style.display = "none";
		alert("Wrong Session ID");
	}
}

// List group click handling
// const wrapper = document.getElementById("song-list-wrapper")
// $('#song-list-wrapper a').addEventListener("click", (btnEvent) => mscBtnHandler(btnEvent));
$('#song-list-wrapper a').on("click", (btnEvent) => mscListHandler(btnEvent));

function mscListHandler(btnCLickEvent) {
	//get the button that was clicked
	let btn = btnCLickEvent.target;
	//get the classes of the parent as a array
	let classes = btn.classList;
	//check if the parent has one of the event classes
	console.log(classes);
	if (classes.contains("start")) {
		//play the song
		playSong(btn);
	}
}
document.addEventListener("click", (btnEvent) => btnEventHanlder(btnEvent))

function btnEventHanlder(btnCLickEvent) {
	
	//get the button that was clicked
	let btn = btnCLickEvent.target.parentNode;
	//get the classes of the parent as a array
	let classes = btn.classList;
	console.log(classes)
	//check if the parent has one of the event classes
	if (classes.contains("play")) {
		//pause the song
		console.log("Play button clicked");
		unpauseSong(btn)
	}
	if (classes.contains("pause")) {
		//pause the song
		pauseSong(btn);
	}
	if (classes.contains("skip")) {
		//restart the song
		skipSong(btn);
	}
	if (classes.contains("edit")) {
		//edit the song
		editSong(btn);
	}
	if (classes.contains("settings")) {
		//edit the song
		settingsSong(btn);
	}

	if(classes.contains("volume")){
		changeVolume(btn);
	}
}


async function playSong(btn) {
	//get the song url
	let songs = [];
	console.log(btn);
	//get playlist div from btn
	const playlist = btn.getElementsByClassName("playlist")[0];
	playlist.childNodes.forEach(song => {
		const id = Math.floor(Math.random() * 1000000)
		if (song.innerHTML !== "") {
			songs.push({
				"song_id": id,
				"url": song.innerHTML,
				"start_time": "0",
			});
		}
	})
	let response = await playMusic(songs);
	let songId = response.id;
	console.log(response)
	//get the children of the parent
	if (response.status) {
		delay(100).then(() => { changeButtonState(btn, "play", "pause"); });
		//add song id to the parent
		document.getElementById("icon").classList.add("active");
		document.getElementById("songTitle").innerText = btn.innerText;
		document.getElementById("cover").src = response.data.icon;
		document.getElementById("videoTitle").innerText = response.data.title;
		document.getElementById("btn-play").classList.remove("play");
		document.getElementById("btn-play").classList.add("pause");
		btn.setAttribute("song-id", songId);
		currentSong = songId;
		changePlayButtonState(true);
	}
}

async function skipSong(btn) {
	//get the song url
	let response = await skipMusic();
	if (response.status) {
		console.log("Icon: " + response.data.icon);
		console.log("Title: " + response.data.title);
		document.getElementById("cover").src = response.data.icon; 
		document.getElementById("videoTitle").innerText = response.data.title
	}
	let res = await unpauseMusic();
	if (res) {
		const playbtn = document.getElementById("btn-play");
		changeButtonState(playbtn, "play", "pause");
		changePlayButtonState(true);
	}
}

async function pauseSong(btn) {
	//get the song id of the parent
	const resp = await pauseMusic();
	console.log(resp);
	if (resp) {
		changeButtonState(btn, "pause", "play");
		changePlayButtonState(false);
		console.log("Running pauseSong");
	} else {
		console.log("Error pausing song");
	}
}

async function unpauseSong(parent) {
	//get the song id of the parent
	const resp = await unpauseMusic();
	console.log(resp);
	if (resp) {
		changeButtonState(parent, "play", "pause");
		changePlayButtonState(true);
		console.log("Running unpauseSong");
	} else {
		console.log("Error unpausing song");
	}
}


function changePlayButtonState(state) {
	if (state) {
		$('#btn-play em').removeClass("fa-play");
		$('#btn-play em').addClass("fa-pause");
		console.log("show pause button")
	} else if (!state) {
		$('#btn-play em').removeClass("fa-pause");
		$('#btn-play em').addClass("fa-play");
		console.log("show play button")
	}
}

async function changeVolume(btn){
	let volume = btn.children[1].value;
	let res = await changeVol(volume);
	console.log(res)
	console.log(volume);
}


function changeButtonState(button, prevState, newState) {
	button.classList.remove(prevState);
	button.classList.add(newState);
}


function delay(time) {
	return new Promise(resolve => setTimeout(resolve, time));
}


function parseYoutubeThumbnail(url) {
	url.split("=");
	let id = url.split("=")[1];
	return "https://img.youtube.com/vi/" + id + "/0.jpg";
}

