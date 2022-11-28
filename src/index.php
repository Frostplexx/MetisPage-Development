<?php
//import loadHeader function
require_once "utils.php";

// load header, main page and footer
$mainPage = fopen("../assets/oldHTML/index.html", "r");
$footer = fopen("../assets/oldHTML/footer.html", "r");
// open main page, header, footer from oldHTML
loadHeader();
echo fread($mainPage, filesize("../assets/oldHTML/index.html"));
echo fread($footer, filesize("../assets/oldHTML/footer.html"));

fclose($mainPage);
fclose($footer);
