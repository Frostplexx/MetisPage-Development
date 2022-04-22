// Fetch all the forms we want to apply custom Bootstrap validation styles to
var forms = document.querySelectorAll('.needs-validation')

// Loop over them and prevent submission
Array.prototype.slice.call(forms)
	.forEach(function (form) {
		form.addEventListener('submit', function (event) {
			if (!form.checkValidity()) {
				event.preventDefault()
				event.stopPropagation()
			} else {
				// If the form is valid, submit it
				console.log("Form is valid, submitting...");
				event.preventDefault()
				sendForm(event.target)
			}

			form.classList.add('was-validated')
		}, false)
	})


//when the user selects other Language, set the input field to required
$('#otherLang').click(function () {
    if($(this).is(':checked')) {
        $('#otherLangInput').attr('required');
    } else {
        $('#otherLangInput').removeAttr('required');
    }
});
$('#englishLang').click(function () {
    if(!$(this).is(':checked')) {
        $('#otherLangInput').attr('required');
    } else {
        $('#otherLangInput').removeAttr('required');
    }
});

$('#germanLang').click(function () {
    if(!$(this).is(':checked')) {
        $('#otherLangInput').attr('required');
    } else {
        $('#otherLangInput').removeAttr('required');
    }
});


function sendForm(form){
	//parse form to senable google forms data
	const googleFormsData = parseHTMLFormToGoogleFormData(form);
	console.log(googleFormsData);

	
}


function parseHTMLFormToGoogleFormData(form) {
	//console.log(form);
	const formData = new FormData(form);
	const formJSON = JSON.stringify(Object.fromEntries(formData.entries()));
	return {
		"campaign_name": formData.get("campaign_name"),
		"dm_name": formData.get("dm_name"),
		"language": getLanguage(form),
		"description": formData.get("description"),
		"difficulty": document.querySelector('input[name="diffucltyRadio"]:checked').value,
		"players_max": formData.get("players_max"),
		"location": formData.get("location"),
		"time": formData.get("time"),
		"notes": formData.get("notes"),
		"icon": document.querySelector('input[name="iconRadios"]:checked').value,
		"dm_tag": formData.get("dm_tag"),
	}
}

function getLanguage(form) {
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

