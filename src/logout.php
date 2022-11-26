<?php

session_start(); 
session_destroy(); 

header('Location: '. getenv("DOMAIN"). '/index.php');