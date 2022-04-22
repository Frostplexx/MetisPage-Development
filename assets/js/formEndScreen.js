const params = new Proxy(new URLSearchParams(window.location.search), {
	get: (searchParams, prop) => searchParams.get(prop),
});

window.onload = function () {
	document.getElementById("message").innerHTML = params.message;
	if (params.success == "true") {
		document.getElementById("status").innerText = "Your campaign was successfully created! 🎉";

	} else {
		document.getElementById("status").innerText = "😔 There was an error creating your campaign. Please see below on what went wrong.";
	} 
	if(params.data !== undefined && params.data !== null){
		document.getElementById("data").innerHTML = params.data;
	}
}