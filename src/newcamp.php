<?php
// load header, main page and footer
$header = fopen("../assets/oldHTML/header.html", "r");
$footer = fopen("../assets/oldHTML/footer.html", "r");

echo fread($header, filesize("../assets/oldHTML/header.html"));
session_start(); // start session
// get date
$today = time();
if(isset($_GET['code'])){
	$code = $_GET['code'];
}

if (empty($code) and !isset($_SESSION['access_token'])) {
	$newcamp = fopen("../assets/html/newCampLogin.html", "r");
	echo fread($newcamp, filesize("../assets/html/newCampLogin.html"));
	fclose($newcamp);
} else if (isset($_SESSION['access_token']) and $_SESSION['expires_in'] >= $today) {
	// redirect to loadnewCampForm.php
	echo "<script>window.location.href = 'loadnewCampForm.php';</script>";
} else {
	// show loading screen while getting the access token and user info
	$loading = fopen("../assets/html/newCampLoading.html", "r");
	echo fread($loading, filesize("../assets/html/newCampLoading.html"));
	fclose($loading);
	// html redirect to newCamp2.php
	echo "<script>window.location.href='getAccessToken.php?code=$code'</script>";
}
echo fread($footer, filesize("../assets/oldHTML/footer.html"));


// check if there is a query parameter in the url


// open main page, header, footer from oldHTML
// load login page 
fclose($header);
fclose($footer);
