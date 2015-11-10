<?php 

    require_once 'functions.php';
    require_once('db-connect.php');

    $kanjis = array();
    $searching = false;
    $whereKanji = "";
    $whereName = "";
    $whereCat = "";

    if(isset($_GET['category']) && $_GET['category']!='0'){
        $whereCat = " AND belongs.cat_id='".$_GET['category']."'";
    }

    if(isset($_GET['reading_name'])){
        $searching=true;
        $whereName = " WHERE readings.name='".$_GET['reading_name']."'";
    }

    foreach($db->query("SELECT * FROM kanjis") as $kanji){

        if(!$searching)  $whereKanji = " WHERE kanjis.id='".$kanji['id']."'";

        $readings = array();
        foreach($db->query("SELECT readings.id as id, readings.name AS name, hiraganas.name AS hiragana, romajis.name AS romaji FROM readings INNER JOIN kanjis ON kanjis.id=readings.kanji_id INNER JOIN hiraganas ON readings.id=hiraganas.reading_id INNER JOIN romajis ON romajis.reading_id=readings.id INNER JOIN belongs ON belongs.reading_id=readings.id".$whereKanji.$whereCat.$whereName) as $reading){

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
                'categories' => $categories
            );
            
            if(!name_exists($object['name'], $readings)) array_push($readings, $object);
            if($searching){ 
                echo json_encode($readings); die;
            }
        }
        
        $object = array(
            'id'=>$kanji['id'],
            'name'=>$kanji['name'],
            'readings'=>$readings
        );
        if(count($readings)!=0) array_push($kanjis, $object);
        
    }

    echo json_encode($kanjis);
