<?php

session_start(); 
session_destroy(); 

header('Location: '. getenv("DOMAIN"). '/src/index.php');