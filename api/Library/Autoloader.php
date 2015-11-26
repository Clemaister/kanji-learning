<?php

    require_once __DIR__ . "/Password.php";
    require_once __DIR__ . "/Database.php";
    require_once __DIR__ . "/Rooter.php";
    require_once __DIR__ . "/FontController.php";
    require_once __DIR__ . "/../controller/user.php";
    require_once __DIR__ . "/../controller/categories.php";
    require_once __DIR__ . "/../controller/readings.php";
    require_once __DIR__ . "/../controller/kanjis.php";

    $fontController = new FontController();
    $fontController->run();
    