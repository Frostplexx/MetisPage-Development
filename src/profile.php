<?php
//import loadHeader function
require_once "utils.php";
require_once "userHandler/user.php";
session_start();
$user = unserialize($_SESSION['user']);
if ($user == null or !$user->isAuthenticated() or !$user instanceof User) {
    header("Location: index.php");
    exit();
}

$username = $user->getUsername();
$avatar = $user->getAvatar();
$userinfo = $user->getCampaignsUserInfo();
$guilds = $userinfo['guilds'];

//parse campaigns
$campaigns = $userinfo["campaigns"];
$campfile = fopen("../assets/html/profile/campaigntemplate.html", "r");


$guildfile = fopen("../assets/html/profile/guilds.html", "r");
$guildFileString = fread($guildfile, filesize("../assets/html/profile/guilds.html"));

$echiotr = "";
//loop through guilds and concat to guildfilestring
$campaignFileString = fread($campfile, filesize("../assets/html/profile/campaigntemplate.html"));

foreach ($guilds as $guild) {
    $tmpr = str_replace("title", $guild['name'], $guildFileString);
    $tmpr = str_replace("imgsource","https://cdn.discordapp.com/icons/" . $guild["id"] . "/". $guild['icon'] . ".png", $tmpr);

    $echostring = "";
    foreach ($campaigns as $campaign){
        if ($campaign["server_id"] == $guild["id"]){
            $temp = str_replace("title", $campaign["campaign_name"], $campaignFileString);
            $temp = str_replace("description", $campaign["description"], $temp);
            $temp = str_replace("difficulty", $campaign["difficulty"], $temp);
            $temp = str_replace("playerscur", $campaign["current_players"], $temp);
            $temp = str_replace("playersmax", $campaign["max_players"], $temp);
            $temp = str_replace("dm", $campaign["dm_name"], $temp);
            $temp = str_replace("lang", $campaign["language"], $temp);
            $temp = str_replace("loc", $campaign["location"], $temp);
            $temp = str_replace("time", $campaign["time"], $temp);
            $temp = str_replace("notes", $campaign["notes"], $temp);
            $echostring .= $temp;
        }
    }
    $tmpr = str_replace("<!-- campaigns -->", $echostring, $tmpr);
    $echiotr .= $tmpr;
}
// load header, main page and footer
$mainPage = fopen("../assets/html/profile.html", "r");
$footer = fopen("../assets/oldHTML/footer.html", "r");
// open main page, header, footer from oldHTML
$mainString = fread($mainPage, filesize("../assets/html/profile.html"));
$mainString = str_replace("<!-- servers -->", $echiotr, $mainString);
$mainString = str_replace("username", $username, $mainString);
$mainString = str_replace("imgsrc", $avatar, $mainString);

loadHeader(true);
echo $mainString;
echo fread($footer, filesize("../assets/oldHTML/footer.html"));

fclose($mainPage);
fclose($footer);
fclose($campfile);
fclose($guildfile);
