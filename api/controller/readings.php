<?php 

class Readings{
    
    private $db;
    
    public function __construct(){
        $this->db = new Database();
    }
    
    private function name_exists($name, $readings){
        $exists=false;
        $i=0;
        while(!$exists && $i<count($readings)){
            if($readings[$i]['name']==$name) $exists=true;
            else $i++;
        }
        return $exists;
    }
    
    public function search($name){
        
        $readings = array();
        $rows = $this->db->get("readings.id", "id")->andGet("readings.name", "name")->andGet("hiraganas.name", "hiragana")->andGet("romajis.name", "romaji")->andGet("meanings.name", "meaning")->andGet("examples.name", "example")->from("readings")->innerjoin("hiraganas", "hiraganas.reading_id", "readings.id")->innerjoin("romajis", "romajis.reading_id", "readings.id")->innerjoin("meanings", "meanings.reading_id", "readings.id")->innerjoin("examples", "examples.reading_id", "readings.id")->innerjoin("belongs", "belongs.reading_id", "readings.id")->where("readings.name", "=", urldecode($name[0]))->execute();
         
        foreach($rows as $reading){

            $categories = array();
            $rows = $this->db->get("categories.id", "id")->andGet("categories.desc", "description")->from("belongs")->innerjoin("categories", "belongs.cat_id", "categories.id")->where("belongs.reading_id", "=", $reading['id'])->execute();
            
            foreach($rows as $category){

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

            if(!$this->name_exists($object['name'], $readings)) array_push($readings, $object);

        }

        echo json_encode($readings);
        
    }
    
    public function get_all($category){

        $category = empty($category) ? null : $category[0];
        $readings = array();
        $rows = $this->db->get("readings.id", "id")->andGet("readings.name", "name")->andGet("hiraganas.name", "hiragana")->andGet("romajis.name", "romaji")->andGet("meanings.name", "meaning")->andGet("examples.name", "example")->from("readings")->innerjoin("hiraganas", "hiraganas.reading_id", "readings.id")->innerjoin("romajis", "romajis.reading_id", "readings.id")->innerjoin("meanings", "meanings.reading_id", "readings.id")->innerjoin("examples", "examples.reading_id", "readings.id")->innerjoin("belongs", "belongs.reading_id", "readings.id")->where("belongs.cat_id", "=", $category)->execute();
        
        foreach($rows as $reading){

            $categories = array();
            $rows = $this->db->get("categories.id", "id")->from("belongs")->innerjoin("categories", "belongs.cat_id", "categories.id")->where("belongs.reading_id", "=", $reading['id'])->execute();
            
            foreach($rows as $category) array_push($categories, $category['id']);

            $object = array(
                'id' => $reading['id'],
                'name' => $reading['name'],
                'hiragana' => $reading['hiragana'],
                'romaji' => $reading['romaji'],
                'meaning' => $reading['meaning'],
                'example' => $reading['example'],
                'categories' => $categories
            );

            if(!$this->name_exists($object['name'], $readings)) array_push($readings, $object);

        }

        echo json_encode($readings);

    }
    
}