<?php
require_once 'env.php';
require_once 'userHandler/user.php';
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

    //get user stuff from session
    $user = unserialize($_SESSION['user']);
    //check if user is of type User
    if ($user == null or !$user->isAuthenticated() or !$user instanceof User) {
        header("Location: login.php?to=profile");
        exit();
    }
    $username = $user->getUsername();
    $user_id = $user->getId();

    $schedule_start = $_POST["schedule_start"];
    $schedule_time = $_POST["schedule_time"];

    $frequency = $_POST["frequency"];
    $repamount = $_POST["repamount"];

    $scheduleData = array(
        "schedule_start" => $schedule_start,
        "schedule_time" => $schedule_time,
        "frequency" => $frequency,
        "repamount" => $repamount
    );
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
		"dm_tag" => $username,
		"server_id" => $serverid,
		"user_id" => $user_id,
        "schedule" => $scheduleData
	);
	// open campGetBotResponse.php and send the json object to campGetBotResponse.php
	$_SESSION["campData"] = json_encode($campData);
	header("Location: campGetBotResponse.php");
	exit();
} else {
	header("Location: loadnewCampForm.php?error=recaptcha");
}
