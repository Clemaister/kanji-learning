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