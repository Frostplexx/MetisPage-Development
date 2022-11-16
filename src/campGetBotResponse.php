<?php

// encode the json object
require_once 'env.php';
$botURL = getenv("BOT_URL");
$bearer = getenv("BOT_BEARER"); 


// load header, main page and footer
$header = fopen("../assets/oldHTML/header.html", "r");
$footer = fopen("../assets/oldHTML/footer.html", "r");
$end = fopen("../assets/oldHTML/formEndScreen.html", "r");
$endscreen = fread($end, filesize("../assets/oldHTML/formEndScreen.html"));
echo fread($header, filesize("../assets/oldHTML/header.html"));

//$campData = json_encode($campData);
session_start();
$campData = $_SESSION["campData"];
// open campGetBotResponse.php and send the json object
//$_SESSION["campData"] = $campData;
if($campData == ""){
	echo "<script>window.location.href = 'newcamp.php';</script>";
}
//send the json object to the bot 
$crl = curl_init();
curl_setopt($crl, CURLOPT_URL, $botURL."/form");
curl_setopt($crl, CURLOPT_POST, 1);
curl_setopt($crl, CURLOPT_POSTFIELDS, $campData);
curl_setopt($crl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($crl, CURLOPT_HTTPHEADER, array(
	'Content-Type: application/json',
	"Authentication: Bearer $bearer"
));
$_SESSION["campData"] = "";
$response = curl_exec($crl);
//check if the bot responded with a 200 status code
if(curl_getinfo($crl, CURLINFO_HTTP_CODE) == 200){
	//show the end screen
	$endscreen = str_replace("<!-- endscreenMessage -->", "Success! 🎉", $endscreen);
	$endscreen = str_replace("<!-- endscreenData -->", "Your campaign has sucessfully been created, you can now close this tab!", $endscreen);
	echo $endscreen;
} else {
	//show the error screen
	$endscreen = str_replace("<!-- endscreenMessage -->", "Oh no! Something went wrong 😔", $endscreen);
	$endscreen = str_replace("<!-- endscreenData -->", "Something went wrong with creating your campaign: ".curl_getinfo($crl, CURLINFO_HTTP_CODE) ."\n".$response, $endscreen);
	echo $endscreen;
}
curl_close($crl);
echo fread($footer, filesize("../assets/oldHTML/footer.html"));

fclose($header);
fclose($footer);
fclose($end);