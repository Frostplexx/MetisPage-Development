<?php
require_once "userHandler/user.php";
session_start();
$user = unserialize($_SESSION['user']);

$username = $user->getUsername();
$avatar = $user->getAvatar();
$id = $user->getId();
$guilds = $user->getCampaignsUserInfo()["guilds"];

$guildsString = "";

// load newcamp.html
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
if($guilds != null){
    foreach($guilds as $guild){
        $guildsString .= "<option value='" . $guild["id"] . "'>" . $guild["name"] . "</option>";
    }
}
$campForm = str_replace("ServerListOptions", $guildsString, $campForm);

require_once "utils.php";

loadHeader();echo $campForm;
echo fread($footer, filesize("../assets/oldHTML/footer.html"));


fclose($footer);
fclose($newcamp);