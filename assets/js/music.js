import {
	authenticate,
	setToken,
	playMusic,
	pauseMusic,
	unpauseMusic,
	skipMusic,
	changeVol,
	getPlayerState,
} from "./websocket.js";


//authentication handling -- checks if token is valid
const loginButton = document.getElementById("submitbutton");
loginButton.addEventListener("click", login);

async function login() {
	const password = document.getElementById("sessionInput").value;
	let loginwindow = document.getElementById("login");
	let dashboardwindow = document.getElementById("dashboard");
	let response = await authenticate(password);
	if (response) {
		await setPlayerState(password);
		loginwindow.style.display = "none";
		loginwindow.style.opacity = "0";
		dashboardwindow.style.display = "inline-block";
		setToken(password);
	} else {
		document.getElementById("btn-spinner").style.display = "none";
		alert("Wrong Session ID");
	}
}


document.addEventListener("click", (btnEvent) => btnEventHanlder(btnEvent))
function btnEventHanlder(btnCLickEvent) {
	//get the button that was clicked
	let btn = btnCLickEvent.target.parentNode;
	//get the classes of the parent as a array
	let classes = btn.classList;
	//check if the parent has one of the event classes
	if (classes === undefined) return;
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

	if (classes.contains("volume")) {
		changeVolume(btn);
	}
	if (classes.contains("start")) {
		playSong(btn);
	}
	if (classes.contains("add-song")) {
		addSongInput(btn);
	}
}




// --------- music player functions ----------//
async function playSong(btn) {
	//get the song url
	let songs = [];
	//get playlist div from btn
	const playlist = btn.parentNode.parentNode.parentNode.parentNode.getElementsByClassName("playlist")[0];
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
	console.log(response);
	let songId = response.id;
	console.log(response)
	//get the children of the parent
	if (response.status) {
		delay(100).then(() => { changeButtonState(btn, "play", "pause"); });
		document.getElementById("player").classList.add("active");
		let url = songs[0].url;
		updatePlayer(response.data.icon, response.data.title, document.getElementById("volume").value, "playing", url);
		changePlayButtonState(true);
		//add song id to the parent
		btn.setAttribute("song-id", songId);
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

async function skipSong(btn) {
	//get the song url
	let response = await skipMusic();
	if (response.status) {
		console.log("player: " + response.data.player);
		console.log("Title: " + response.data.title);
		document.getElementById("cover").src = response.data.player;
		document.getElementById("videoTitle").innerText = response.data.title
	}
	let res = await unpauseMusic();
	if (res) {
		const playbtn = document.getElementById("btn-play");
		changeButtonState(playbtn, "play", "pause");
		changePlayButtonState(true);
	}
}

async function changeVolume(btn) {
	let volume = btn.children[1].value;
	let res = await changeVol(volume);
	console.log(res)
	console.log(volume);
}

// -------------------//

async function setPlayerState(token) {
	const response = await getPlayerState(token);
	const state = response.data
	if (!response.status || state.song.url === undefined) return;
	updatePlayer(state.song.thumbnail, state.song.title, state.volume, state.state, state.song.url);
}



/**
 * Update the player with the given data
 * @param  {} thubmnail
 * @param  {} title
 * @param  {} volume
 * @param  {} playState
 * @param  {} url
 */
export function updatePlayer(thubmnail, title, volume, playState, url) {
	document.getElementById("player").classList.add("active");
	document.getElementById("cover").style.backgroundImage = `url(${thubmnail})`;
	document.getElementById("videoTitle").innerText = title;
	document.getElementById("volume").value = volume;
	if (playState === "playing") {
		document.getElementById("btn-play").classList.remove("play");
		document.getElementById("btn-play").classList.add("pause");
		changePlayButtonState(false);
	}
	// get the playlist title
	var conty = document.getElementById("playlists-container"), divs = conty.querySelectorAll("div"), myDiv = [...divs].filter(e => e.innerText == url);
	if(myDiv[0] === undefined) return; 
	const playlistName = myDiv[0].parentNode.parentNode.children[0].children[1].children[0].innerText;
	console.log(playlistName);
	document.getElementById("songTitle").innerText = playlistName;
}

// --------- helper functions ----------//
function delay(time) {
	return new Promise(resolve => setTimeout(resolve, time));
}

function changeButtonState(button, prevState, newState) {
	button.classList.remove(prevState);
	button.classList.add(newState);
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


// --------- getting playlists info for dashboard ----------//
window.onload = function ()  {
	let children = document.getElementById("playlists-container").children;
	for (const child of children) {
		if(child.classList.contains("playlist-card")){
			//set icon and amount of songs
			const playlist = child.children[1]
			const card = child.children[0] 
			card.children[1].children[1].innerText = playlist.childElementCount + " Songs";
			let thubmnailId = playlist.children[0].innerHTML.split("=")[1];
			card.children[0].src = `https://img.youtube.com/vi/${thubmnailId}/hqdefault.jpg`;
		
		}
	}

	// load the local storage
	let playlists = JSON.parse(localStorage.getItem("playlists"));
	if(playlists && playlists !== "{}"){
		allPlaylists = new Map(Object.entries(playlists));
		loadPlaylists();
	}
}



// ------------- playlist creation handler -------------//

// add new song input field when you click on the add button
var allPlaylists = new Map();

document.getElementById("add-song-btn").addEventListener("click",(btnEvent) => addSongInput(btnEvent));
function addSongInput(btnEvent) {
	// create input group
	const inputGroup = document.createElement("div");
	inputGroup.classList.add("input-group");
	inputGroup.style.marginTop = "10px";


	//create the actual input field
	const input = document.createElement("input");
	input.classList.add("form-control");
	input.setAttribute("type", "text");
	inputGroup.appendChild(input);


	//creae the remove button
	const removeBtn = document.createElement("button");
	removeBtn.classList.add("btn", "btn-primary", "text-white", "text-center", "removeSongPlaylist");
	removeBtn.setAttribute("type", "button");
	//add the remove icon
	removeBtn.innerHTML = `<em class="fa-solid fa-xmark"></em>`;
	inputGroup.appendChild(removeBtn);
	document.getElementById("playlist-creator-urls").appendChild(inputGroup);
}


//remove song input field when you click on the remove button
document.getElementById("songAdder").addEventListener("click", (btnEvent) => removeSongInput(btnEvent));
function removeSongInput(btnEvent) {
	console.log("click")
	const btn = btnEvent.target;
	console.log(btn)
	if (btn.classList.contains("removeSongPlaylist") ) {
		btn.parentNode.remove();
	} else if(btn.parentNode.classList.contains("removeSongPlaylist")){
		btn.parentNode.parentNode.remove();
	}
}


//save the playlist
document.getElementById("save-playlist-btn").addEventListener("click", (btnEvent) => savePlaylist(btnEvent));
async function savePlaylist(btnEvent) {
	// get the playlist name
	const playlistName = document.getElementById("playlist-creator-name").value;
	if(playlistName === "") return;
	//get the playlist urls
	const playlistDivs = document.getElementById("playlist-creator-urls").children;
	const URLs = [];
	for (const child of playlistDivs){
		let url = child.children[0].value;
		URLs.push(url);
	}
	if(URLs.length === 0) return;
	//generate playlist object
	safePlaylist(playlistName, URLs);
	loadPlaylists();
} 

function safePlaylist(playlistName, URLs) {
	allPlaylists.set(playlistName, URLs);
	localStorage.setItem("playlists", JSON.stringify(Object.fromEntries(allPlaylists)));
}

function loadPlaylists(){
	//delete old playlists 
	document.getElementById("playlists-container").innerHTML = "";
	//loop through all playlists
	if(!allPlaylists) return;
	for (const [key, value] of allPlaylists) {
		//generate the playlist card
		const playlistCard = document.createElement("div");
		playlistCard.classList.add("col", "col-sm-3", "playlist-card");
		playlistCard.style.width = "fit-content";
		document.getElementById("playlists-container").appendChild(playlistCard);

		//generate the card
		const card = document.createElement("div");
		card.classList.add("card", "bg-dark");
		card.style.width = "13rem";
		card.style.borderRadius = "15px"; 
		card.style.padding = "10px";
		playlistCard.appendChild(card);

		//generate the card image
		const cardImg = document.createElement("img");
		cardImg.classList.add("card-img-top");
		cardImg.setAttribute("alt", "card header");
		cardImg.style.borderRadius = "15px";
		const thumbnailId = value[0].split("=")[1];
		cardImg.src = `https://img.youtube.com/vi/${thumbnailId}/hqdefault.jpg`
		card.appendChild(cardImg);

		//generate the card body
		const cardBody = document.createElement("div");
		cardBody.classList.add("card-body");
		card.appendChild(cardBody);

		//generate the card title
		const cardTitle = document.createElement("h5");
		cardTitle.classList.add("card-title");
		cardTitle.innerText = key;
		cardBody.appendChild(cardTitle);

		//generate the card text
		const cardText = document.createElement("p");
		cardText.classList.add("card-text", "text-muted");
		cardText.innerText = value.length + " Songs";
		cardBody.appendChild(cardText);

		//generate the button group
		const buttonGroup = document.createElement("div");
		buttonGroup.classList.add("btn-group");
		buttonGroup.setAttribute("role", "group");
		buttonGroup.setAttribute("aria-label", "play and edit btn");
		buttonGroup.style.float = "inline-end";
		cardBody.appendChild(buttonGroup);

		//generate the play button
		const playBtn = document.createElement("a");
		playBtn.classList.add("btn", "btn-primary", "start");
		playBtn.innerHTML = `<em class="fa-solid fa-play"></em>`;
		buttonGroup.appendChild(playBtn);

		//generate the edit button
		const editBtn = document.createElement("a");
		editBtn.classList.add("btn", "btn-primary", "edit");
		editBtn.innerHTML = `<em class="fa-solid fa-pen"></em>`;
		buttonGroup.appendChild(editBtn);

		//generate the playlist container
		const playlistContainer = document.createElement("div");
		playlistContainer.classList.add("playlist");
		playlistCard.appendChild(playlistContainer);
		for(const url of value){
			const song = document.createElement("div");
			song.classList.add("song-url");
			song.innerText = url;
			playlistContainer.appendChild(song);
		}

	}
}