<?php
// load header, main page and footer
$header = fopen("../assets/oldHTML/header.html", "r");
$footer = fopen("../assets/oldHTML/footer.html", "r");

echo fread($header, filesize("../assets/oldHTML/header.html"));