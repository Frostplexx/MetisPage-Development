import { baseUrl, bearerToken, discordOAuthURL, loginPage } from "./globals.js";

var access_token = localStorage.getItem("access_token");
var refresh_token = localStorage.getItem("refresh_token");
var expires_in = localStorage.getItem("expires_in");
var scope = localStorage.getItem("scope");
var tokenType = localStorage.getItem("tokenType");
var guildId = null;
var userId = null;
var dm_tag = null;
//get code from url
const params = new Proxy(new URLSearchParams(window.location.search), {
	get: (searchParams, prop) => searchParams.get(prop),
});
const authCode = params.code;

//call bot to get back the auth token
async function getAuthToken() {
	try {
		const response = await fetch(baseUrl + "/auth/" + authCode, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				//authorization: 'Bearer ' + token
				Authorization: "Bearer " + bearerToken,
			},
		});
		return response.json();
	} catch (error) {
		if (error.message === "Load failed") {
			document.getElementById("campConnectionErrorMessage").innerText =
				"405 - Connection to server failed. Wrong URL?";
			//show campConnectionErrorModal modal
			$("#campConnectionErrorModal").modal("show");
		} else {
			document.getElementById("campConnectionErrorMessage").innerText = error.message;
			//show campConnectionErrorModal modal
			$("#campConnectionErrorModal").modal("show");
		}
	}
}

//call get auth token when page is loaded
window.onload = async function () {
	//check if access token exists
	console.log("access_token: " + access_token);
	if (access_token === null) {
		//check if auth code exists
		if (authCode === null) {
			//redirect to login page
			window.location.href = loginPage;
		} else {
			//get auth token
			const auth = await getAuthToken();
			console.log(auth);
			//save auth token to local storage
			localStorage.setItem("access_token", auth.access_token);
			localStorage.setItem("refresh_token", auth.refresh_token);
			//convert seconds to date object
			const expires_in = new Date(new Date().getTime() + auth.expires_in * 1000);
			localStorage.setItem("expires_in", expires_in);
			localStorage.setItem("scope", auth.scope);
			localStorage.setItem("tokenType", auth.tokenType);
		}
	} else {
		//check if token is expired
		const expires_in = new Date(localStorage.getItem("expires_in"));
		if (expires_in < new Date()) {
			//go to login page
			window.location.href = loginPage;
		}
	}

	const me = await getMe();
	document.getElementById("dmDiscordTagImg").src =
		"https://cdn.discordapp.com/avatars/" + me["user"]["id"] + "/" + me["user"]["avatar"] + ".png";
	document.getElementById("dmDiscordTag").innerText = me["user"]["username"] + "#" + me["user"]["discriminator"];
	userId = me["user"]["id"];
	dm_tag = me["user"]["username"] + "#" + me["user"]["discriminator"];
	//fill server list
	fillServerList();
};

// Fetch all the forms we want to apply custom Bootstrap validation styles to
var forms = document.querySelectorAll(".needs-validation");
// Loop over them and prevent submission
Array.prototype.slice.call(forms).forEach(function (form) {
	form.addEventListener(
		"submit",
		function (event) {
			if (!form.checkValidity()) {
				event.preventDefault();
				event.stopPropagation();
			} else {
				// If the form is valid, submit it
				console.log("Form is valid, submitting...");
				event.preventDefault();
				sendForm(event.target);
			}

			form.classList.add("was-validated");
		},
		false
	);
});

//when the user selects other Language, set the input field to required
$("#otherLang").click(function () {
	if ($(this).is(":checked")) {
		$("#otherLangInput").attr("required");
	} else {
		$("#otherLangInput").removeAttr("required");
	}
});
$("#englishLang").click(function () {
	if (!$(this).is(":checked")) {
		$("#otherLangInput").attr("required");
	} else {
		$("#otherLangInput").removeAttr("required");
	}
});

$("#germanLang").click(function () {
	if (!$(this).is(":checked")) {
		$("#otherLangInput").attr("required");
	} else {
		$("#otherLangInput").removeAttr("required");
	}
});

async function sendForm(form) {
	//set guildId to what the user selected in the dmServer select
	guildId = document.getElementById("dmServer").value;

	const button = form.querySelector('button[type="submit"]');
	button.disabled = true;
	button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
	//parse form to senable google forms data
	const googleFormsData = parseHTMLFormToGoogleFormData(form);
	console.log(googleFormsData);
	//open ws connection
	const response = await httpSendForms(googleFormsData);
	//forward the user to a endscreen
	console.log(response);
	window.location.href = "formEndScreen.html" + "?message=" + response.message + "&success=" + response.status;
	button.innerHTML = "Submit Form";
	button.disabled = false;
}

function parseHTMLFormToGoogleFormData(form) {
	const formData = new FormData(form);
	return {
		campaign_name: formData.get("campaign_name"),
		dm_name: formData.get("dm_name"),
		language: getLanguage(),
		description: formData.get("description"),
		difficulty: document.querySelector('input[name="diffucltyRadio"]:checked').value,
		players_max: formData.get("players_max"),
		location: formData.get("location"),
		time: formData.get("time"),
		notes: formData.get("notes"),
		icon: document.querySelector('input[name="iconRadios"]:checked').value,
		dm_tag: dm_tag,
	};
}

function getLanguage() {
	const lang = document.querySelector('input[name="languageRadio"]:checked').value;
	switch (lang) {
		case "en":
			return "English";
		case "de":
			return "Deutsch";
		case "ot":
			return document.getElementById("otherLangInput").value;
	}
}

async function httpSendForms(formData) {
	try {
		const response = await fetch(baseUrl + "/form", {
			method: "POST",
			body: JSON.stringify(formData),
			headers: {
				"Content-Type": "application/json",
				//authorization: 'Bearer ' + token
				Authorization: "Bearer " + bearerToken,
				//set guildid as header
				guildid: guildId,
				//set userid as header
				userid: userId,
			},
		});
		return await response.json();
	} catch (error) {
		if (error.message === "Load failed") {
			document.getElementById("campConnectionErrorMessage").innerText =
				"420 - Connection to server failed. Wrong URL?";
			//show campConnectionErrorModal modal
			$("#campConnectionErrorModal").modal("show");
		} else {
			document.getElementById("campConnectionErrorMessage").innerText = error.message;
			//show campConnectionErrorModal modal
			$("#campConnectionErrorModal").modal("show");
		}
	}
}

async function getMe() {
	//get user of the token
	try {
		const response = await fetch(discordOAuthURL + "/oauth2/@me", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				//authorization: 'Bearer ' + token
				Authorization: "Bearer " + access_token,
			},
		});
		return await response.json();
	} catch (error) {
		if (error.message === "Load failed") {
			document.getElementById("campConnectionErrorMessage").innerText =
				"420 - Connection to server failed. Wrong URL?";
			//show campConnectionErrorModal modal
			$("#campConnectionErrorModal").modal("show");
		} else {
			document.getElementById("campConnectionErrorMessage").innerText = error.message;
			//show campConnectionErrorModal modal
			$("#campConnectionErrorModal").modal("show");
		}
	}
}

async function fillServerList() {
	const serverListhtml = document.getElementById("dmServer");
	const guilds = await fetch(discordOAuthURL + "/users/@me/guilds", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			//authorization: 'Bearer ' + token
			Authorization: "Bearer " + access_token,
		},
	});
	const guildsJson = await guilds.json();
	//loop trough guilds and add them to the server list
	guildsJson.forEach((guild) => {
		const option = document.createElement("option");
		option.value = guild.id;
		option.innerText = guild.name;
		serverListhtml.appendChild(option);
	});
}
