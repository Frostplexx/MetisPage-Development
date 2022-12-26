<?php
//import loadHeader function
require_once "utils.php";
require_once "userHandler/user.php";
session_start();
$user = unserialize($_SESSION['user']);
if ($user == null or !$user->isAuthenticated() or !$user instanceof User) {
    header("Location: login.php?to=profile");
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
    $tmpr = str_replace("imgsource", "https://cdn.discordapp.com/icons/" . $guild["id"] . "/" . $guild['icon'] . ".png", $tmpr);

    $echostring = "";
    foreach ($campaigns as $campaign) {
        if ($campaign["server_id"] == $guild["id"]) {
            $temp = str_replace("title", $campaign["campaign_name"], $campaignFileString);
            $temp = str_replace("description", $campaign["description"], $temp);
            $temp = str_replace("difficulty", $campaign["difficulty"], $temp);
            $temp = str_replace("playerscur", $campaign["current_players"], $temp);
            $temp = str_replace("playersmax", $campaign["max_players"], $temp);
            $temp = str_replace("dm", $campaign["dm_name"] . " | " . $campaign["dm_tag"], $temp);
            $temp = str_replace("lang", $campaign["language"], $temp);
            $temp = str_replace("loc", $campaign["location"], $temp);
            $temp = str_replace("time", $campaign["time"], $temp);
            $temp = str_replace("notes", $campaign["notes"], $temp);

            if ($campaign["schedule"]["schedule_start"] == "") {
                $temp = str_replace('<br><i class="fa-solid fa-hourglass-end"></i> When: <span>when</span><br><i class="fa-solid fa-arrows-rotate"></i> Repeat: <span>repeat</span>', "<span>No schedule</span>", $temp);
            } else {
                $temp = str_replace("when", $campaign["schedule"]["schedule_start"] . " at " . $campaign["schedule"]["schedule_time"], $temp);
                $temp = str_replace("repeat", "Every " . $campaign["schedule"]["repamount"] . " " . $campaign["schedule"]["frequency"], $temp);

                $temp = str_replace("messagelink", "https://discord.com/channels/" . $campaign["server_id"] . "/" . $campaign["channels"]["textChannel"] . "/" . $campaign["message_id"], $temp);
            }

            if ($campaign["dm_tag"] == $user->getUsername()) {
                $temp = str_replace("<!-- edit bnt -->", '<a href="/src/editcamp.php?id=' . $campaign["campaign_id"] . '" class="btn btn-secondary">Edit <i class="fa-solid fa-pen-to-square"></i></a>', $temp);
            }
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
