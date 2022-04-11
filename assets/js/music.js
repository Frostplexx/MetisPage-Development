import {
	authenticate,
	setToken,
	playMusic,
	pauseMusic,
	unpauseMusic,
	skipMusic,
	changeVol,
	getPlayerState,
	code,
} from "./websocket.js";


//authentication handling -- checks if token is valid
const loginButton = document.getElementById("submitbutton");
loginButton.addEventListener("click", login);

async function login() {
	loginButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
	loginButton.disabled = true;
	const password = document.getElementById("sessionInput").value;
	let loginwindow = document.getElementById("login");
	let dashboardwindow = document.getElementById("dashboard");
	let response = await authenticate(password);
	console.log(response);
	if (response) {
		document.getElementById("connection-status").innerHTML = '<em class="fas fa-link"></em> Connected'
		document.getElementById("session-id").innerText = password
		await setPlayerState(password);
		loginwindow.style.display = "none";
		loginwindow.style.opacity = "0";
		dashboardwindow.style.display = "inline-block";
		setToken(password);
		enableLoginBtn();
	} else {
		alert("Wrong Session ID");
		enableLoginBtn();
	}
}

function enableLoginBtn() {
	loginButton.innerHTML = 'Enter <em em class="fas fa-sign-in" ></em>';
	loginButton.disabled = false;
}


document.addEventListener("click", (btnEvent) => btnEventHanlder(btnEvent))
function btnEventHanlder(btnCLickEvent) {
	//get the button that was clicked
	let btn = btnCLickEvent.target.parentNode;
	//get the classes of the parent as a array
	let classes = btn.classList;
	console.log(classes);
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
		addSongInput("", "playlist-creator-urls");
	}
	if (classes.contains("showfab")) {
		showFab()
	}
	if (classes.contains("advanced")) {
		toggleAdvanced()
	}
}




// --------- music player functions ----------//
async function playSong(btn) {
	btn.children[0].style.display = "none";
	btn.children[1].style.display = "inline-block";
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
	//get the children of the parent
	if (response.type === "__broadcast__") {
		delay(100).then(() => { changeButtonState(btn, "play", "pause"); });
		document.getElementById("player").classList.add("active");
		btn.children[0].style.display = "inline-block";
		btn.children[1].style.display = "none";
		$("#player-grid").show();
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
	console.log(response);
	const state = response.data
	if (!response.status || state.song.url === undefined) {
		$("#player-grid").hide();
	} else {
		updatePlayer(state.song.thumbnail, state.song.title, state.volume, state.state, state.song.url);
		$("#player-grid").show();
	}
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

	//update thumbnail
	if (thubmnail !== undefined) {
		document.getElementById("cover").style.backgroundImage = `url(${thubmnail})`;
	}
	//update title
	if (title !== undefined) {
		document.getElementById("videoTitle").innerText = title;
	}
	//update volume
	if (volume !== undefined) {
		document.getElementById("volume").value = volume;
	}
	//update play state
	if (playState !== undefined) {
		if (playState === "playing") {
			document.getElementById("btn-play").classList.remove("play");
			document.getElementById("btn-play").classList.add("pause");
			changePlayButtonState(true);
		} else if (playState === "paused") {
			document.getElementById("btn-play").classList.remove("pause");
			document.getElementById("btn-play").classList.add("play");
			changePlayButtonState(false);
		}
	}
	//update url
	if (url !== undefined) {
		console.log("url: " + url);
		console.log("searching for playlist name")
		// get the playlist title
		var conty = document.getElementById("playlists-container"), divs = conty.querySelectorAll("div"), myDiv = [...divs].filter(e => e.innerText == url);
		console.log("conty", conty);
		if (myDiv[0] === undefined) return;
		let playlistName = myDiv[0].parentNode.parentNode.children[0].children[1].children[0].innerText;
		console.log("playlistName: " + playlistName);
		console.log(playlistName);
		if(playlistName.includes("https://")) playlistName = myDiv[0].parentNode.children[0].children[1].children[0].innerText;
		document.getElementById("songTitle").innerText = playlistName;
	}

}

// --------- helper functions ----------//
function delay(time) {
	return new Promise(resolve => setTimeout(resolve, time));
}

function changeButtonState(button, prevState, newState) {
	button.classList.remove(prevState);
	button.classList.add(newState);
}

/**
 * Change the play button state: true = show pause btn, false = show play btn
 * @param  {} state
 */
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
window.onload = function () {
	let children = document.getElementById("playlists-container").children;
	for (const child of children) {
		if (child.classList.contains("playlist-card")) {
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
	if (playlists && playlists !== "{}") {
		allPlaylists = new Map(Object.entries(playlists));
		loadPlaylists();
	}

	const srvurl = localStorage.getItem("serverURL");
	document.getElementById("customServer").value = srvurl;

	//see if search parameter is present 
	const params = new Proxy(new URLSearchParams(window.location.search), {
		get: (searchParams, prop) => searchParams.get(prop),
	});
	// Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
	let id = params.session; // "some_value"
	if (id !== undefined && id !== null) {
		document.getElementById("sessionInput").value = id;
	}


	// auto login 
	const tkn = document.getElementById("sessionInput").value
	if (tkn !== "" && tkn !== undefined) {
		//set timeout to prevent the user from clicking the login button
		setTimeout(() => {
			login();
		}
			, 500);
	} else if (code !== undefined && code !== "") {
		setTimeout(() => {
			loginWithCode();
		}
			, 500);
	}
}



// ------------- playlist creation handler -------------//

// add new song input field when you click on the add button
var allPlaylists = new Map();

document.getElementById("add-song-btn").addEventListener("click", () => addSongInput("", "playlist-creator-urls"));
document.getElementById("add-edit-song-btn").addEventListener("click", () => addSongInput("", "playlist-editor-urls"));

function addSongInput(value = "", appendID) {
	console.log(appendID)
	// create input group
	const inputGroup = document.createElement("div");
	inputGroup.classList.add("input-group");
	inputGroup.style.marginTop = "10px";

	//create the actual input field
	const input = document.createElement("input");
	input.classList.add("form-control");
	input.setAttribute("type", "text");
	inputGroup.appendChild(input);

	if (value !== "") {
		console.log("adding value " + value);
		input.value = value;
	}

	//creae the remove button
	const removeBtn = document.createElement("button");
	removeBtn.classList.add("btn", "btn-primary", "text-white", "text-center", "removeSongPlaylist");
	removeBtn.setAttribute("type", "button");
	//add the remove icon
	removeBtn.innerHTML = `<em class="fa-solid fa-xmark"></em>`;
	inputGroup.appendChild(removeBtn);
	document.getElementById(appendID).appendChild(inputGroup);

}


//remove song input field when you click on the remove button
document.getElementById("songAdder").addEventListener("click", (btnEvent) => removeSongInput(btnEvent));
function removeSongInput(btnEvent) {
	console.log("click")
	const btn = btnEvent.target;
	console.log(btn)
	if (btn.classList.contains("removeSongPlaylist")) {
		btn.parentNode.remove();
	} else if (btn.parentNode.classList.contains("removeSongPlaylist")) {
		btn.parentNode.parentNode.remove();
	}
}


//save the playlist
document.getElementById("save-playlist-btn").addEventListener("click", (btnEvent) => savePlaylist(btnEvent));
async function savePlaylist(btnEvent) {
	// get the playlist name
	const playlistName = document.getElementById("playlist-creator-name").value;
	if (playlistName === "") return;
	//get the playlist urls
	const playlistDivs = document.getElementById("playlist-creator-urls").children;
	const URLs = [];
	for (const child of playlistDivs) {
		let url = child.children[0].value;
		if (url.includes("youtube.com/watch?v=") || url.includes("youtu.be/")) {
			URLs.push(url);
		} else if (url.includes("https://www.youtube.com/playlist?")) {
			console.error("playlist url not supported yet");
		} else if (url.includes("https://open.spotify.com/track/")) {
			URLs.push(url);
		}
	}
	if (URLs.length === 0) return;
	//generate playlist object
	safePlaylist(playlistName, URLs);
	loadPlaylists();
}

function getPlaylist() {
	//return the songs from a youtube playlist

}


function safePlaylist(playlistName, URLs) {
	allPlaylists.set(playlistName, URLs);
	localStorage.setItem("playlists", JSON.stringify(Object.fromEntries(allPlaylists)));
}

function loadPlaylists() {
	//delete old playlists 
	document.getElementById("playlists-container").innerHTML = "";
	//loop through all playlists
	if (!allPlaylists) return;
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

		//generate the loading spinner 
		const spinner = document.createElement("div");
		spinner.classList.add("spinner-border", "spinner-border-sm");
		spinner.setAttribute("role", "status");
		spinner.setAttribute("aria-hidden", "true");
		spinner.style.display = "none";
		playBtn.appendChild(spinner);

		//generate the edit button
		const editBtn = document.createElement("a");
		editBtn.classList.add("btn", "btn-primary", "edit");
		editBtn.setAttribute("data-bs-toggle", "modal")
		editBtn.setAttribute("data-bs-target", "#editPlaylist")
		editBtn.innerHTML = `<em class="fa-solid fa-pen"></em>`;
		buttonGroup.appendChild(editBtn);

		//generate the playlist container
		const playlistContainer = document.createElement("div");
		playlistContainer.classList.add("playlist");
		playlistCard.appendChild(playlistContainer);
		for (const url of value) {
			const song = document.createElement("div");
			song.classList.add("song-url");
			song.innerText = url;
			playlistContainer.appendChild(song);
		}

	}
}


// ------- playlist editor handler -------- //
var oldTitle = "";
// fill edit song modal
function editSong(btn) {
	const cardBody = btn.parentNode.parentNode
	const playlistName = cardBody.parentNode.children[1].children[0].innerText
	const URLDiv = cardBody.parentNode.parentNode.children[1].children
	oldTitle = playlistName;
	//set appropriate values in the modal
	document.getElementById("playlist-editor-name").value = playlistName;
	document.getElementById("playlist-editor-urls").innerHTML = "";
	for (let child of URLDiv) {
		if (child.classList.contains("song-url")) {
			addSongInput(child.innerText, "playlist-editor-urls");
		}
	}
}

//remove song input field when you click on the remove button
document.getElementById("songEditor").addEventListener("click", (btnEvent) => removeSongInput(btnEvent));

// save new playlist 
document.getElementById("save-edit-btn").addEventListener("click", (btnEvent) => saveEdit(btnEvent));
async function saveEdit(btn) {
	const title = btn.target.parentNode.parentNode.children[1].children[0].children[0].children[1].value;
	const playlistDivs = btn.target.parentNode.parentNode.children[1].children[0].children[1].children[1].children;
	console.log(playlistDivs);
	let playlists = [];
	for (let child of playlistDivs) {
		playlists.push(child.children[0].value);
	}

	//delete old playlist
	allPlaylists.delete(oldTitle);
	//safe the playlist
	safePlaylist(title, playlists);
	loadPlaylists();
}

// delete button handling 
document.getElementById("delete-song-btn").addEventListener("click", (btnEvent) => deleteSong(btnEvent));
function deleteSong(btn) {
	const title = btn.target.parentNode.parentNode.parentNode.children[1].children[0].children[0].children[1].value;
	allPlaylists.delete(title);
	localStorage.setItem("playlists", JSON.stringify(Object.fromEntries(allPlaylists)));
	loadPlaylists();
}


//------ FAB ------//
function showFab() {
	let fab = document.getElementById("fab");
	if (fab.classList.contains("active")) {
		document.getElementById("outer-fab").style.transform = "rotate(0deg)";
		$("#inner-fab-container").hide();
		$("#inner-fab-container").css("opacity", "0");
		fab.classList.remove("active");
	} else {
		document.getElementById("outer-fab").style.transform = "rotate(45deg)";
		$("#inner-fab-container").show();
		$("#inner-fab-container").css("opacity", "1");
		fab.classList.add("active");
	}
}


//------ Backup and Restore ------//
document.getElementById("exportPlaylists").addEventListener("click", () => exportPlaylists());
function exportPlaylists() {
	const data = JSON.stringify(Object.fromEntries(allPlaylists), "", "\t");
	const filename = "playlists.json";
	var file = new Blob([data], { type: "json" });
	if (window.navigator.msSaveOrOpenBlob) // IE10+
		window.navigator.msSaveOrOpenBlob(file, filename);
	else { // Others
		var a = document.createElement("a"),
			url = URL.createObjectURL(file);
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(function () {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		}, 0);
	}
}

document.getElementById("importPlaylists").addEventListener("click", () => importPlaylists());
function importPlaylists() {
	//upload file
	document.getElementById("file-upload").click();
	document.getElementById("file-upload").addEventListener("change", (e) => {
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.onload = (e) => {
			const data = JSON.parse(e.target.result);
			for (const [key, value] of Object.entries(data)) {
				safePlaylist(key, value);
			}
			loadPlaylists();
		}
		reader.readAsText(file);
	}
	);
}

//------ Developer Mode Stuff ------//
function toggleAdvanced() {
	const advanced = document.getElementById("advancedMode");
	if (advanced.classList.contains("active")) {
		advanced.classList.remove("active");
		$("#advancedArrow").css("transform", "rotate(0deg)");
		$("#customServer").hide();
	} else {
		advanced.classList.add("active");
		$("#advancedArrow").css("transform", "rotate(180deg)");
		$("#customServer").show();
	}
}

document.getElementById("customServer").addEventListener("change", () => {
	localStorage.setItem("serverURL", document.getElementById("customServer").value);
})