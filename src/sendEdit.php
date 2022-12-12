<?php
require_once "utils.php";
require_once "env.php";

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
$user_id = $_SESSION["id"];

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
    "dm_tag" => $_SESSION["username"],
    "server_id" => $serverid,
    "user_id" => $user_id
);

$camp = $_POST[''];
$url = getenv("BOT_URL") . "/id/";
$bearer = getenv("BOT_BEARER");
$payload = json_encode();
