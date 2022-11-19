<?php
// load header, main page and footer
$mainPage = fopen("assets/oldHTML/index.html", "r");
$header = fopen("assets/oldHTML/header.html", "r");
$footer = fopen("assets/oldHTML/footer.html", "r");
// open main page, header, footer from oldHTML
echo fread($header, filesize("assets/oldHTML/header.html"));
echo fread($mainPage, filesize("assets/oldHTML/index.html"));
fclose($mainPage);
fclose($header);
