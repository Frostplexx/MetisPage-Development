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
