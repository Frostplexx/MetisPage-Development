<?php
// load header, main page and footer
$header = fopen("../assets/oldHTML/header.html", "r");
$footer = fopen("../assets/oldHTML/footer.html", "r");
require_once "userHandler/user.php";
echo fread($header, filesize("../assets/oldHTML/header.html"));
session_start(); // start session
// get date
$today = time();

if (isset($_GET['code'])) {
    $code = $_GET['code'];
}
if (isset($_GET['to'])) {
    if ($_GET['to'] == "camp") {
        $_SESSION["redirect"] = "/src/loadnewCampForm.php";
    } else if ($_GET["to"] == "index") {
        $_SESSION["redirect"] = "/src/index.php";
    } else if($_GET["to"] == "profile"){
        $_SESSION["redirect"] = "/src/profile.php";
    }
}

$user = null;
if (isset($_SESSION['user'])) {
    $user = unserialize($_SESSION['user']);
}

if (empty($code) and !isset($_SESSION['user'])) {
    $newcamp = fopen("../assets/html/newCampLogin.html", "r");
    $newCampStr =  fread($newcamp, filesize("../assets/html/newCampLogin.html"));
    $newCampStr = str_replace("hans", $_GET['to'], $newCampStr);
    echo $newCampStr;
    fclose($newcamp);
} else if ($user != null and $user instanceof User and $user->isAuthenticated()) {
    // redirect to loadnewCampForm.php
    header('Location: ' . getenv("DOMAIN") . $_SESSION["redirect"]);
    $_SESSION["redirect"] = "";
    exit();
} else if (isset($code)) {

    $user = new User($code);
    $user->authenticate();
    $_SESSION['user'] = serialize($user);
    header('Location: ' . getenv("DOMAIN") . $_SESSION["redirect"]);
    $_SESSION["redirect"] = "";
    exit();
}
echo fread($footer, filesize("../assets/oldHTML/footer.html"));


// check if there is a query parameter in the url

// open main page, header, footer from oldHTML
// load login page
fclose($header);
fclose($footer);
