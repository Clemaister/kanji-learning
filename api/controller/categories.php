<?php 

class Categories{
    
    private $db;
    
    public function __construct(){
        $this->db = new Database();
    }
    
    public function get_all(){

        $categories = array();
        $rows = $this->db->get("*")->from("categories")->execute();
        
        foreach($rows as $category){
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

    }
    
}