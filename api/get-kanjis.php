<?php 

    require_once 'functions.php';
    require_once 'db-connect.php';

    $kanjis = array();
    $searching = false;

    foreach($db->query("SELECT * FROM kanjis") as $kanji){

        $readings = array();
        foreach($db->query("SELECT readings.id as id, readings.name AS name, hiraganas.name AS hiragana, romajis.name AS romaji, meanings.name AS meaning, examples.name AS example FROM readings INNER JOIN kanjis ON kanjis.id=readings.kanji_id INNER JOIN hiraganas ON readings.id=hiraganas.reading_id INNER JOIN romajis ON romajis.reading_id=readings.id INNER JOIN meanings ON meanings.reading_id=readings.id INNER JOIN examples ON examples.reading_id=readings.id INNER JOIN belongs ON belongs.reading_id=readings.id WHERE kanjis.id='".$kanji['id']."'") as $reading){

            $categories = array();
            foreach($db->query("SELECT categories.id AS id, categories.desc AS description FROM belongs INNER JOIN categories ON belongs.cat_id=categories.id WHERE belongs.reading_id='".$reading['id']."'") as $category){

                $object = array(
                    'id' => $category['id'],
                    'desc' => $category['description']
                );
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
        }
        
        $object = array(
            'id'=>$kanji['id'],
            'name'=>$kanji['name'],
            'readings'=>$readings
        );
        if(count($readings)!=0) array_push($kanjis, $object);
        
    }

    echo json_encode($kanjis);
