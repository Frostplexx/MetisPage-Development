<?php

session_start();
$username = $_SESSION['username'];
$avatar = $_SESSION['avatar'];
$id = $_SESSION['id'];
$guilds = $_SESSION['guilds'];
$guildsString = "";

// load newcamp.html
$header = fopen("../assets/oldHTML/header.html", "r");
$footer = fopen("../assets/oldHTML/footer.html", "r");
$newcamp = fopen("../assets/oldHTML/newcamp.html", "r");

$campForm = fread($newcamp, filesize("../assets/oldHTML/newcamp.html"));

$campForm = str_replace("Discord#1234", $username, $campForm);
$campForm = str_replace("discordAvatarSourceURL", $avatar, $campForm);

if(isset($_SESSION["campData"])){
	//load the form data into the form 
	$campData = $_SESSION["campData"];
	//save campaign data to local storage
	
}

if(isset($_GET["error"])) {
	if($_GET["error"] == "recaptcha"){
		$campForm = str_replace("<!-- recaptchaError -->", "<p class='text-danger'>Please complete the captcha</p>", $campForm);
	}
}

// loop trough the guilds and add them to a string
foreach ($guilds as $guild) {
	$guildsString .= '<option value="'. $guild["id"].'">'.$guild["name"].'</option>';
}

$campForm = str_replace("SeerverListOptions", $guildsString, $campForm);

echo fread($header, filesize("../assets/oldHTML/header.html"));
echo $campForm;
echo fread($footer, filesize("../assets/oldHTML/footer.html"));


fclose($header);
fclose($footer);
fclose($newcamp);