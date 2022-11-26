<?php
require_once 'env.php';

//------------- make api call to discord to get access token 
$code = $_GET['code'];

$clientID = getenv('DISCORD_CLIENT_ID');
$clientSecret = getenv('DISCORD_CLIENT_SECRET');
$redirectURI = getenv('DISCORD_REDIRECT_URI');

$crl = curl_init();

curl_setopt($crl, CURLOPT_URL, "https://discord.com/api/v10/oauth2/token");
curl_setopt($crl, CURLOPT_POST, 1);
curl_setopt($crl, CURLOPT_POSTFIELDS, "client_id=$clientID&client_secret=$clientSecret&grant_type=authorization_code&code=$code&redirect_uri=$redirectURI");
curl_setopt($crl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($crl, CURLOPT_HTTPHEADER, array(
	'Content-Type: application/x-www-form-urlencoded'
));
session_start();

$response = curl_exec($crl);
echo $response;
curl_close($crl);

// decode to json
$decoded_response = json_decode($response, true);
$acces_token = $decoded_response['access_token'];
// convert minutes to date
$expires_in = time() + $decoded_response['expires_in'] * 60;
// save to session storage
$_SESSION['access_token'] = $acces_token;
$_SESSION['expires_in'] = $expires_in;

//-------------- get user info from discord

$crl = curl_init();

curl_setopt($crl, CURLOPT_URL, "https://discord.com/api/v10/oauth2/@me");
curl_setopt($crl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($crl, CURLOPT_HTTPHEADER, array(
	"Content-Type: application/json",
	"Authorization: Bearer $acces_token"
));

$response = curl_exec($crl);
$decoded_response = json_decode($response, true);

if($decoded_response["user"] == null){
    echo $response;
    exit();
}
if($decoded_response["user"]["avatar"] == null){
    $_SESSION["avatar"] = "https://cdn.discordapp.com/embed/avatars/0.png";
} else {
    $_SESSION["avatar"] = "https://cdn.discordapp.com/avatars/" . (string)$decoded_response["user"]["id"]  . "/" . $decoded_response["user"]["avatar"] . ".png";
}
$_SESSION["username"] = $decoded_response["user"]["username"] . "#" . $decoded_response["user"]["discriminator"];
$_SESSION["id"] = (string)$decoded_response["user"]["id"];

curl_close($crl);


//------------ load guilds from discord

$crl = curl_init();

curl_setopt($crl, CURLOPT_URL, "https://discord.com/api/v10/users/@me/guilds");
curl_setopt($crl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($crl, CURLOPT_HTTPHEADER, array(
	"Content-Type: application/json",
	"Authorization: Bearer $acces_token"
));

$response = curl_exec($crl);
$decoded_response = json_decode($response, true);

curl_close($crl);

// ----- send guilds to bot to get the correct guilds back 
$guilds = $response; 
$crl = curl_init();
curl_setopt($crl, CURLOPT_URL, getenv("BOT_URL")."/guilds");
curl_setopt($crl, CURLOPT_POST, 1);
curl_setopt($crl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($crl, CURLOPT_POSTFIELDS, $guilds);
curl_setopt($crl, CURLOPT_HTTPHEADER, array(
	"Content-Type: application/json",
	"Authorization: Bearer ".getenv("BOT_BEARER")
));

$response = curl_exec($crl);
$decoded_response = json_decode($response, true);
$_SESSION["guilds"] = $decoded_response;

curl_close($crl);

header('Location: '. getenv("DOMAIN")  . '/src/loadnewCampForm.php');
