import { authenticate, setToken } from "./api.js";

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

const loginButton = document.getElementById("submitbutton");
loginButton.addEventListener("click", login);