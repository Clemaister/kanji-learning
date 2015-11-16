<?php 

    require_once('db-connect.php');

    $categories = array();

    foreach($db->query("SELECT * FROM categories") as $category){
        if($category){

            $object = array(
                'id'=> $category['id'],
                'desc'=> $category['desc'],
                'code'=> $category['code']
            );

            array_push($categories, $object);
        }
        
    }
    echo json_encode($categories);
         
?>