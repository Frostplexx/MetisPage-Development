<?php

session_start();
$username = $_SESSION['username'];
$avatar = $_SESSION['avatar'];
$id = $_SESSION['id'];

// load newcamp.html
$header = fopen("assets/oldHTML/header.html", "r");
$footer = fopen("assets/oldHTML/footer.html", "r");
$newcamp = fopen("assets/oldHTML/newcamp.html", "r");

$campForm = fread($newcamp, filesize("assets/oldHTML/newcamp.html"));

$campForm = str_replace("Discord#1234", $username, $campForm);
$campForm = str_replace("discordAvatarSourceURL", $avatar, $campForm);

echo fread($header, filesize("assets/oldHTML/header.html"));
echo $campForm;
echo fread($footer, filesize("assets/oldHTML/footer.html"));

fclose($header);
fclose($footer);
fclose($newcamp);