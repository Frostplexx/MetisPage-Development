const params = new Proxy(new URLSearchParams(window.location.search), {
	get: (searchParams, prop) => searchParams.get(prop),
});

window.onload = function () {
	document.getElementById("message").innerHTML = params.message;
	if (params.success == "true") {
		document.getElementById("status").innerText = "Success! 🎉";

	} else {
		document.getElementById("status").innerText = "Oh no! Something went wrong 😔";
	} 
	if(params.data !== undefined && params.data !== null){
		document.getElementById("data").textContent = params.data;
	}
}