<?php

$wordC = ($_GET['word1']);
$textC = "https://traininfo.jr-central.co.jp/zairaisen/data/hp_zaisenichijoho_" . $wordC . "_ja.json";
echo file_get_contents($textC);
