import { baseUrl, bearerToken } from "./globals.js";
let AuthObject = {
	campaignID: "",
	userID: "",
	token: "",
};
window.onload = async function () {
	//see if search parameter is present
	const params = new Proxy(new URLSearchParams(window.location.search), {
		get: (searchParams, prop) => searchParams.get(prop),
	});

	// Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
	let id = params.token; // "some_value"
	console.log(id);
	if (id == null || id == "") {
		window.location.href = "formEndScreen.html?message=Campaign ID is empty&success=false";
	} else {
		// convert from base64 to ascii
		id = atob(id);
		const ids = id.split("-");
		AuthObject = {
			campaignID: ids[0],
			userID: ids[1],
			token: ids[2],
		};
		try {
			// check if campaign is even editable
			const editable = await checkIfCampaignEditable(AuthObject);
			console.log(editable);
			if (editable.status == false) {
				window.location.href = "formEndScreen.html?message=" + editable.message + "&success=false";
			} else {
				const campaign = await requestCampaignInfo(AuthObject.campaignID);
				fillInForm(campaign);
			}
		} catch (error) {
			console.log(error);
		}
	}
};
// http://127.0.0.1:3000/edit.html?token=OGI3NTMyOTFhMzItMzM2ODA2MTk3MTU4MjE1NjgyLTY2ZTU2M2FjM2Y=
async function requestCampaignInfo(id) {
	try {
		const response = await fetch(baseUrl + "/id/" + id, {
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
			document.getElementById("campConnectionErrorMessage").innerText = "420 - Connection to server failed. Wrong URL?";
			//show campConnectionErrorModal modal
			$("#campConnectionErrorModal").modal("show");			
		} else {
			document.getElementById("campConnectionErrorMessage").innerText = error.message;
			//show campConnectionErrorModal modal
			$("#campConnectionErrorModal").modal("show");
		}
	}
}

async function checkIfCampaignEditable(AuthObject) {
	try {
		const response = await fetch(baseUrl + "/checkEditable/" + AuthObject.token + "-" + AuthObject.campaignID, {
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
			document.getElementById("campConnectionErrorMessage").innerText = "420 - Connection to server failed. Wrong URL?";
			//show campConnectionErrorModal modal
			$("#campConnectionErrorModal").modal("show");			
		} else {
			document.getElementById("campConnectionErrorMessage").innerText = error.message;
			//show campConnectionErrorModal modal
			$("#campConnectionErrorModal").modal("show");
		}

		return false;
	}
}

function fillInForm(campaign) {
	console.log(campaign);
	const form = document.getElementById("editCampForm");
	form.querySelector('input[name="campaign_name"]').value = campaign.campaign_name;
	form.querySelector('input[name="dm_name"]').value = campaign.dm_name;
	form.querySelector('textarea[name="description"]').value = campaign.description;
	form.querySelector('input[name="players_max"]').value = campaign.players_max;
	form.querySelector('input[name="location"]').value = campaign.location;
	form.querySelector('input[name="time"]').value = campaign.time;
	form.querySelector('textarea[name="notes"]').value = campaign.notes;

	//parse language
	if (campaign.language == "English") {
		form.querySelector('input[name="languageRadio"][value="en"]').checked = true;
	} else if (campaign.language == "Deutsch") {
		form.querySelector('input[name="languageRadio"][value="de"]').checked = true;
	} else {
		form.querySelector('input[name="languageRadio"][value="ot"]').checked = true;
		form.querySelector('input[name="other_language"]').value = campaign.language;
	}

	//parse difficulty
	if (campaign.difficulty == "Easy") {
		form.querySelector('input[name="diffucltyRadio"][value="Easy"]').checked = true;
	}
	if (campaign.difficulty == "Medium") {
		form.querySelector('input[name="diffucltyRadio"][value="Medium"]').checked = true;
	}
	if (campaign.difficulty == "Expert/Difficult") {
		form.querySelector('input[name="diffucltyRadio"][value="Expert/Difficult"]').checked = true;
	}
}

// send the form

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
	const button = form.querySelector('button[type="submit"]');
	button.disabled = true;
	button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
	//parse form to senable google forms data
	const googleFormsData = parseHTMLFormToGoogleFormData(form);
	console.log(googleFormsData);
	//open ws connection
	const response = await httpSendForms(googleFormsData, AuthObject);
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
		new_dm_tag: formData.get("new_dm_tag") ? formData.get("new_dm_tag") : "",
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

async function httpSendForms(formData, AuthObject) {
	// combine formData and AuthObject
	const data = {
		...AuthObject,
		...formData,
	};
	console.log(data);
	const response = await fetch(baseUrl + "/id/" + AuthObject.campaignID, {
		method: "PUT",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
			//authorization: 'Bearer ' + token
			Authorization: "Bearer " + bearerToken,
		},
	});
	return await response.json();
}

document.getElementById("cancelCampForm").addEventListener("click", function () {
	window.location.href = "index.html";
});
