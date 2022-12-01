<?php
$footer = fopen("../assets/oldHTML/footer.html", "r");
require_once "utils.php";

loadHeader();
?>



<body style="background: #36393f">

<?php
echo fread($footer, filesize("../assets/oldHTML/footer.html"));
fclose($footer);
?>