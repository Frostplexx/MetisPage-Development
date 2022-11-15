<?php

// encode the json object
require_once 'env.php';
$botURL = getenv("BOT_URL");
$bearer = getenv("BOT_BEARER"); 
//$campData = json_encode($campData);
session_start();
$campData = $_SESSION["campData"];
echo $campData;
// open campGetBotResponse.php and send the json object
//$_SESSION["campData"] = $campData;

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

$response = curl_exec($crl);
echo $response;
curl_close($crl);
