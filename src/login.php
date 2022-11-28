<?php
// load header, main page and footer
$header = fopen("../assets/oldHTML/header.html", "r");
$footer = fopen("../assets/oldHTML/footer.html", "r");
require_once "userHandler/user.php";
echo fread($header, filesize("../assets/oldHTML/header.html"));
session_start(); // start session
// get date
$today = time();
$redirect = "/src/index.php";
if(isset($_GET['code'])){
    $code = $_GET['code'];
}
if(isset($_GET['to'])){
    if($_GET['to'] == "camp"){
        $redirect = "/src/loadnewCampForm.php";
    }
}

if (empty($code) and !isset($_SESSION['user'])) {
    $newcamp = fopen("../assets/html/newCampLogin.html", "r");
    echo fread($newcamp, filesize("../assets/html/newCampLogin.html"));
    fclose($newcamp);
} else if (isset($_SESSION['user']) and $_SESSION['user'] instanceof User and ($_SESSION['user'])->getExpiresIn() >= $today) {
    // redirect to loadnewCampForm.php
    echo "<script>window.location.href = 'loadnewCampForm.php';</script>";
} else {
    // show loading screen while getting the access token and user info
    $loading = fopen("../assets/html/newCampLoading.html", "r");
    echo fread($loading, filesize("../assets/html/newCampLoading.html"));
    fclose($loading);
    // html redirect to newCamp2.php
    echo "<script>window.location.href='getAccessToken.php?code=$code&redirect=$redirect'</script>";
}
echo fread($footer, filesize("../assets/oldHTML/footer.html"));


// check if there is a query parameter in the url

// open main page, header, footer from oldHTML
// load login page
fclose($header);
fclose($footer);
