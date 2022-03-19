import { authenticate, setToken, playMusic, pauseMusic, unpauseMusic, getVideoTitle } from "./api.js";


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

function mscListHandler(btnCLickEvent){
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

function btnEventHanlder(btnCLickEvent){
	//get the button that was clicked
	let btn = btnCLickEvent.target.parentNode;
	//get the classes of the parent as a array
	let classes = btn.classList;
	//check if the parent has one of the event classes
	console.log(classes);
	if (classes.contains("play")) {
		//pause the song
		unpauseSong(btn)
	}
	if (classes.contains("pause")) {
		//pause the song
		pauseSong(btn);
	}
	if (classes.contains("restart")) {
		//restart the song
		restartSong(btn);
	}
	if (classes.contains("edit")) {
		//edit the song
		editSong(btn);
	}
	if (classes.contains("settings")) {
		//edit the song
		settingsSong(btn);
	}
}


async function playSong(btn){
	//get the song url
	let url = btn.getElementsByClassName("song-url")[0].innerHTML;
	console.log("URL: " + url);
	let response = await playMusic(url);
	let songId = response.id;
	//get the children of the parent
	if(response.status){
		delay(100).then(() => {changeButtonState(btn, "play", "pause");});
		//add song id to the parent
		document.getElementById("songTitle").innerText = btn.innerText;
		document.getElementById("cover").src = parseYoutubeThumbnail(url);
		document.getElementById("videoTitle").innerText = await getVideoTitle(url);
		document.getElementById("btn-play").classList.remove("play");
		document.getElementById("btn-play").classList.add("pause");
		console.log(btn.innerText)
		btn.setAttribute("song-id", songId);
		currentSong = songId;
		changePlayButtonState(true);
	}
}



async function pauseSong(parent){
	//get the song id of the parent
	if(!currentSong) return
	const resp = await pauseMusic(currentSong);
	console.log(resp);
	if(resp){
		changeButtonState(parent, "pause", "play");
		changePlayButtonState(false);
		console.log("Running pauseSong");
	} else {
		console.log("Error pausing song");
	}
}

async function unpauseSong(parent){
	//get the song id of the parent
	if(!currentSong) return
	const resp = await unpauseMusic(currentSong);
	console.log(resp);
	if(resp){
		changeButtonState(parent, "play", "pause");
		changePlayButtonState(true);
		console.log("Running unpauseSong");
	} else {
		console.log("Error unpausing song");
	}
}


function changePlayButtonState(state){
	if(state){
		$('#btn-play em').removeClass("fa-play");
		$('#btn-play em').addClass("fa-pause");
		console.log("show pause button")
	} else if (!state){
		$('#btn-play em').removeClass("fa-pause");
		$('#btn-play em').addClass("fa-play");
		console.log("show play button")
	}
}


function changeButtonState(button, prevState, newState){
	button.classList.remove(prevState);
	button.classList.add(newState);
}

function delay(time) {
	return new Promise(resolve => setTimeout(resolve, time));
  }
  

function parseYoutubeThumbnail(url){
	url.split("=");
	let id = url.split("=")[1];
	return "https://img.youtube.com/vi/" + id + "/0.jpg";
}

