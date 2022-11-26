<?php
require_once 'env.php';
session_start();
if (isset($_POST['g-recaptcha-response'])) {
	$captcha = $_POST['g-recaptcha-response'];
}

$secretKey = getenv('CAPTCHA_KEY');
$ip = $_SERVER['REMOTE_ADDR'];
// post request to server
$url = 'https://www.google.com/recaptcha/api/siteverify?secret=' . urlencode($secretKey) .  '&response=' . urlencode($captcha);
$response = file_get_contents($url);
$responseKeys = json_decode($response, true);
// should return JSON with success as true
if ($responseKeys["success"]) {
	// load the form data
	$campName = $_POST["campaign_name"];
	$language = $_POST["language"];
	$description = $_POST["description"];
	$location = $_POST["location"];
	$time = $_POST["time"];
	$max_players = $_POST["players_max"];
	$difficulty = $_POST["diffucltyRadio"];
	$notes = $_POST["notes"] ?? "No notes";
	$dm_name = $_POST["dm_name"];
	$serverid = $_POST["dmServer"];
	$user_id = $_SESSION["id"];

	// parse variables into a json object
	$campData = array(
		"campaign_name" => $campName,
		"language" => $language,
		"description" => $description,
		"location" => $location,
		"time" => $time,
		"max_players" => $max_players,
		"difficulty" => $difficulty,
		"notes" => $notes,
		"dm_name" => $dm_name,
		"dm_tag" => $_SESSION["username"],
		"server_id" => $serverid,
		"user_id" => $user_id
	);
	// open campGetBotResponse.php and send the json object to campGetBotResponse.php
	$_SESSION["campData"] = json_encode($campData);
	header("Location: campGetBotResponse.php");
	exit();
} else {
	header("Location: loadnewCampForm.php?error=recaptcha");
}
