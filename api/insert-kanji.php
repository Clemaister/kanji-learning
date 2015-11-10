<?php

    require_once("db-connect.php");

    $readings = $_POST['readings'];
    $editing = $_POST['editing'];

    if($editing=='true'){
        foreach($readings as $reading){
            $sql=$db->prepare("SELECT id FROM readings WHERE name='".$reading['name']."'");
            $sql->execute();
            $rows = $sql->fetchAll();
            foreach($rows as $row){
                $db->query("DELETE FROM readings WHERE id=".$row['id']);
                $db->query("DELETE FROM hiraganas WHERE reading_id=".$row['id']);
                $db->query("DELETE FROM romajis WHERE reading_id=".$row['id']);
                $db->query("DELETE FROM belongs WHERE reading_id=".$row['id']);
            }
        }
    }

    foreach($readings as $reading){
        
        $no_hiragana=preg_replace("/\p{Hiragana}/u", "", $reading['name']);
        $characters = preg_split("//u", $no_hiragana, -1, PREG_SPLIT_NO_EMPTY);
        
        foreach($characters as $character){
            $sql=$db->prepare("SELECT id FROM kanjis WHERE name='".$character."'");
            $sql->execute();
            $kanjiID = $sql->fetchColumn();
            if($kanjiID == 0) {
                $db->query("INSERT INTO kanjis(name) VALUES('".$character."')");
                $kanjiID=$db->lastInsertId();
            }
            
            $db->query("INSERT INTO readings(kanji_id, name) VALUES('".$kanjiID."', '".$reading['name']."')");
            $readingID=$db->lastInsertId();
            $db->query("INSERT INTO hiraganas(reading_id, name) VALUES('".$readingID."', '".$reading['hiragana']."')");
            $db->query("INSERT INTO romajis(reading_id, name) VALUES('".$readingID."', '".$reading['romaji']."')");

            foreach($reading['categories'] as $category) $db->query("INSERT INTO belongs(reading_id, cat_id) VALUES('".$readingID."', '".$category."')");
        }
        
    }
    