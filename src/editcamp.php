<?php
require_once 'env.php';
require_once 'utils.php';
require_once 'userHandler/user.php';
session_start();

if (isset($_SESSION['user'])) {
    $user = unserialize($_SESSION['user']);
}

if (empty($code) and !isset($_SESSION['user'])) {
    $newcamp = fopen("../assets/html/newCampLogin.html", "r");
    echo fread($newcamp, filesize("../assets/html/newCampLogin.html"));
    fclose($newcamp);
} else if ($user != null and $user instanceof User and $user->isAuthenticated()) {
    // redirect to loadnewCampForm.php
    getUserData($user);
    exit();
} else if (isset($code)) {

    $user = new User($code);
    $user->authenticate();
    $_SESSION['user'] = serialize($user);
    getUserData($user);
    exit();
}


function getUserData(User $user): void
{
    if (isset($_GET['id']) && $_GET['id'] != "") {
        $id = $_GET['id'];
    } else {
        header('Location: index.php');
    }

    //load campaign info from bot
    $boturl = getenv('BOT_URL') . "/id/$id";
    $bearer = getenv('BOT_BEARER');
    $response = makeAPICall($boturl, $bearer, json_encode(array(
        "user_id" => $user->getId(),
    )));

    fillInForm($response);
}



function fillInForm($response): void{
    loadHeader();
    $form = fopen("../assets/oldHTML/edit.html", "r");
    $formString = fread($form, filesize("../assets/oldHTML/edit.html"));
    $formString = str_replace("campaign_name", $response['campaign_name'], $formString);
    $formString = str_replace("language_name", $response['language'], $formString);
    $formString = str_replace("campdescr", $response['description'], $formString);
    $formString = str_replace("camploc", $response['location'], $formString);
    $formString = str_replace("camptime", $response['time'], $formString);
    $formString = str_replace("mxplar", $response['max_players'], $formString);
    switch ($response['difficulty']) {
        case "Beginner/Easy":
            $formString = str_replace("ez-checked", "checked", $formString);
            break;
        case "Medium":
            $formString = str_replace("med-checked", "checked", $formString);
            break;
        case "Expert/Difficult":
            $formString = str_replace("hard-checked", "checked", $formString);
            break;
    }
    $formString = str_replace("campnotes", $response['notes'], $formString);
    $formString = str_replace("dmname", $response['dm_name'], $formString);

    echo $formString;
}