import { authenticate, setToken, playMusic, pauseMusic } from "./api.js";


//authentication handling -- checks if token is valid
const loginButton = document.getElementById("submitbutton");
loginButton.addEventListener("click", login);

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

// button event handling
// const wrapper = document.getElementById("song-list-wrapper")
// $('#song-list-wrapper a').addEventListener("click", (btnEvent) => mscBtnHandler(btnEvent));
$('#song-list-wrapper a').on("click", (btnEvent) => mscBtnHandler(btnEvent));

function mscBtnHandler(btnCLickEvent){
	//get the button that was clicked
	let btn = btnCLickEvent.target;
	//get the classes of the parent as a array
	let classes = btn.classList;
	//check if the parent has one of the event classes
	console.log(classes);
	if (classes.contains("play")) {
		//play the song
		playSong(btn);
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


function playSong(btn){
	//get the song url
	let url = btn.getElementsByClassName("song-url")[0].innerHTML;

	console.log("URL: " + url);
	let songId = playMusic(url);
	//get the children of the parent
	delay(100).then(() => {changeButtonState(btn, "play", "pause");});
	//add song id to the parent
	document.getElementById("songTitle").innerText = btn.innerText;
	document.getElementById("cover").src = parseYoutubeThumbnail(url);
	console.log(btn.innerText)
	btn.setAttribute("song-id", songId);
	changePlayButtonState(true);
}



function pauseSong(parent){
	let parent1 = parent.parentNode.parentNode;
	let id = parent1.getAttribute("song-id");

	let url = document.getElementById(parent1.id).getElementsByClassName("song-url")[0].innerHTML;
	//get the song id of the parent
	pauseMusic(id, url);
	changeButtonState(parent, "pause", "play");
	let children = parent.children;
	console.log(children)
	children[0].classList.remove("fa-pause");
	children[0].classList.add("fa-play");
	console.log("Running pauseSong");
}


function changePlayButtonState(state){
	if(state){
		$('#btn-play em').removeClass("fa-play");
		$('#btn-play em').addClass("fa-pause");
	} else if (!state){
		$('#btn-play em').removeClass("fa-pause");
		$('#btn-play em').addClass("fa-play");
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