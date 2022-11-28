<?php
$header = fopen("../assets/oldHTML/header.html", "r");
$footer = fopen("../assets/oldHTML/footer.html", "r");
echo fread($header, filesize("../assets/oldHTML/header.html"));

?>



<body style="background: #36393f">

<?php
echo fread($footer, filesize("../assets/oldHTML/footer.html"));
fclose($header);
fclose($footer);
?>