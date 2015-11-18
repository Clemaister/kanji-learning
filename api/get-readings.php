<?php 

    require_once 'functions.php';
    require_once 'db-connect.php';

    $searching = false;
    $whereName = "";
    $whereCat = "";

    if(isset($_GET['category']) && $_GET['category']!='0'){
        $whereCat = " WHERE belongs.cat_id='".$_GET['category']."'";
    }

    if(isset($_GET['reading_name'])){
        $searching = true;
        $whereName = " WHERE readings.name='".$_GET['reading_name']."'";
    }

    $readings = array();
    foreach($db->query("SELECT readings.id as id, readings.name AS name, hiraganas.name AS hiragana, romajis.name AS romaji, meanings.name AS meaning, examples.name AS example FROM readings INNER JOIN kanjis ON kanjis.id=readings.kanji_id INNER JOIN hiraganas ON readings.id=hiraganas.reading_id INNER JOIN romajis ON romajis.reading_id=readings.id INNER JOIN meanings ON meanings.reading_id=readings.id INNER JOIN examples ON examples.reading_id=readings.id INNER JOIN belongs ON belongs.reading_id=readings.id".$whereName.$whereCat) as $reading){
        
        $categories = array();
        foreach($db->query("SELECT categories.id AS id, categories.desc AS description FROM belongs INNER JOIN categories ON belongs.cat_id=categories.id WHERE belongs.reading_id='".$reading['id']."'") as $category){

            if($searching) $object = $category['id'];
            else {
                $object = array(
                    'id' => $category['id'],
                    'desc' => $category['description']
                );
            }
            array_push($categories, $object);
        }

        $object = array(
            'id' => $reading['id'],
            'name' => $reading['name'],
            'hiragana' => $reading['hiragana'],
            'romaji' => $reading['romaji'],
            'meaning' => $reading['meaning'],
            'example' => $reading['example'],
            'categories' => $categories
        );
        
        if(!name_exists($object['name'], $readings)) array_push($readings, $object);
        if($searching){
            echo json_encode($readings); 
            die;
        }
        
    }

    echo json_encode($readings);
