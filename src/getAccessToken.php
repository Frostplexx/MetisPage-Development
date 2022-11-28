<?php
require_once 'env.php';
require_once 'userHandler/user.php';
//------------- make api call to discord to get access token
session_start();

$code = $_GET['code'];
$redirect = $_GET['redirect'];

$user = new User($code);
$user->authenticate();

$_SESSION['user'] = $user;

// ----- send guilds to bot to get the correct guilds back 
//$guilds = $user->getGuilds();
//
//$crl = curl_init();
//curl_setopt($crl, CURLOPT_URL, getenv("BOT_URL")."/guilds");
//curl_setopt($crl, CURLOPT_POST, 1);
//curl_setopt($crl, CURLOPT_RETURNTRANSFER, true);
//curl_setopt($crl, CURLOPT_POSTFIELDS, $guilds);
//curl_setopt($crl, CURLOPT_HTTPHEADER, array(
//	"Content-Type: application/json",
//	"Authorization: Bearer ".getenv("BOT_BEARER")
//));
//$response = curl_exec($crl);
//$decoded_response = json_decode($response, true);
//$_SESSION["guilds"] = $decoded_response;
//debug_to_console($decoded_response);
//curl_close($crl);
//header('Location: '. getenv("DOMAIN")  . $redirect);
echo "<script>window.location.href = '$redirect';</script>";

