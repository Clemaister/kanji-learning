<?php

function name_exists($name, $readings){
    $exists=false;
    $i=0;
    while(!$exists && $i<count($readings)){
        if($readings[$i]['name']==$name) $exists=true;
        else $i++;
    }
    return $exists;
}

function reading_exists($reading, $readings){
    $exists=false;
    $i=0;
    while(!$exists && $i<count($readings)){
        if($readings[$i]['name']==$reading['name'] && $readings[$i]['hiragana']==$reading['hiragana'] && $readings[$i]['romaji']==$reading['romaji']) $exists=true;
        else $i++;
    }
    return $exists;
}