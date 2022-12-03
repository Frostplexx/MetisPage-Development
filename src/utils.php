<?php

session_start();
require_once "userHandler/user.php";

function loadHeader($noIcon = false): void
{

    $header = fopen("../assets/oldHTML/header.html", "r");
    $headerString = fread($header, filesize("../assets/oldHTML/header.html"));
    $headerLoggedIn = fopen("../assets/html/header/headerLoggedIn.html", "r");
    $headerLoggedInStr = fread($headerLoggedIn, filesize("../assets/html/header/headerLoggedIn.html"));

    $headerNotLoggedIn = fopen("../assets/html/header/headerNotLoggedIn.html", "r");
    $headerNotLoggedInStr = fread($headerNotLoggedIn, filesize("../assets/html/header/headerNotLoggedIn.html"));

    $user = null;
    if (isset($_SESSION['user'])) {
        $user = unserialize($_SESSION['user']);
    }

    if (!$noIcon) {
        if ($user != null and $user instanceof User and $user->isAuthenticated()) {
            $headerLoggedInStr = str_replace("usericon", $user->getAvatar(), $headerLoggedInStr);
            $headerLoggedInStr = str_replace("username", $user->getUsername(), $headerLoggedInStr);
            $headerString = str_replace("<!-- login-replacer -->", $headerLoggedInStr, $headerString);

        } else {
            $headerString = str_replace("<!-- login-replacer -->", $headerNotLoggedInStr, $headerString);
        }
    }
    echo $headerString;
    fclose($header);
}

/**
 * @param $url string the url to make the api call to
 * @return $decoded_response the decoded response
 */
function makeAPICall(string $url,$bearer, $payload = "")
{
    $crl = curl_init();
    curl_setopt($crl, CURLOPT_URL, $url);
    curl_setopt($crl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($crl, CURLOPT_HTTPHEADER, array(
        "Content-Type: application/json",
        "Authorization: Bearer $bearer"
    ));
    if ($payload != "") {
        curl_setopt($crl, CURLOPT_POSTFIELDS, $payload);
    }
    $response = curl_exec($crl);
    $decoded_response = json_decode($response, true);
    curl_close($crl);
    return $decoded_response;
}