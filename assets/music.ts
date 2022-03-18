import { authenticate, setToken } from "./api";

async function login() {
	const input = document.getElementById("sessionInput")! as HTMLInputElement;
	const password = input.value;
	let loginwindow = document.getElementById("login");
	let dashboardwindow = document.getElementById("dashboard");
	let response = await authenticate(password);
	if (response) {
		loginwindow!.style.display = "none";
		document.getElementById("btn-spinner")!.style.display = "none";
		dashboardwindow!.style.display = "inline-block";
		setToken(password);
	} else {
		document.getElementById("btn-spinner")!.style.display = "none";
		alert("Wrong Session ID");
	}
}

const loginButton = document.getElementById("loginButton")!;
loginButton.addEventListener("click", login);