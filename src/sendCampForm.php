<?php
require_once 'env.php';

if (isset($_POST['g-recaptcha-response'])) {
	$captcha = $_POST['g-recaptcha-response'];
}

$secretKey = getenv('CAPTCHA_KEY');
$ip = $_SERVER['REMOTE_ADDR'];
// post request to server
$url = 'https://www.google.com/recaptcha/api/siteverify?secret=' . urlencode($secretKey) .  '&response=' . urlencode($captcha);
$response = file_get_contents($url);
$responseKeys = json_decode($response,true);
// should return JSON with success as true
if($responseKeys["success"]) {
		echo 'success';

} else {
	header("Location: ../src/loadnewCampForm.php?error=recaptcha");
}