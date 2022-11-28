<?php

session_start();

function loadHeader(): void
{
    $header = fopen("../assets/oldHTML/header.html", "r");
    $headerstr = fread($header, filesize("../assets/oldHTML/header.html"));
    echo $headerstr;
    fclose($header);
}