<?php 

class Kanjis{
    
    private $db;
    
    public function __construct(){
        $this->db = new Database();
    }
    
    private function reading_exists($reading, $readings){
        $exists=false;
        $i=0;
        while(!$exists && $i<count($readings)){
            if($readings[$i]['name']==$reading['name'] && $readings[$i]['hiragana']==$reading['hiragana']) $exists=true;
            else $i++;
        }
        return $exists;
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
    
    public function get_all(){
        
        $kanjis = array();
        
        $rows = $this->db->get("*")->from("kanjis")->execute();
        foreach($rows as $kanji){

            $readings = array();
            $rows = $this->db->get("readings.id", "id")->andGet("readings.name", "name")->andGet("hiraganas.name", "hiragana")->andGet("romajis.name", "romaji")->andGet("meanings.name", "meaning")->andGet("examples.name", "example")->from("readings")->innerjoin("kanjis", "kanjis.id", "readings.kanji_id")->innerjoin("hiraganas", "hiraganas.reading_id", "readings.id")->innerjoin("romajis", "romajis.reading_id", "readings.id")->innerjoin("meanings", "meanings.reading_id", "readings.id")->innerjoin("examples", "examples.reading_id", "readings.id")->innerjoin("belongs", "belongs.reading_id", "readings.id")->where("kanjis.id", "=", $kanji['id'])->execute();
            
            foreach($rows as $reading){

                $categories = array();
                $rows = $this->db->get("categories.id", "id")->andGet("categories.desc", "description")->from("belongs")->innerjoin("categories", "belongs.cat_id", "categories.id")->where("belongs.reading_id", "=",  $reading['id'])->execute();
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

            $object = array(
                'id'=>$kanji['id'],
                'name'=>$kanji['name'],
                'readings'=>$readings
            );
            if(count($readings)!=0) array_push($kanjis, $object);

        }

        echo json_encode($kanjis);
        
    }
    
    public function insert(){
        
        $readings = $_POST['readings'];
        $editing = $_POST['editing'];

        if($editing=='true'){

            foreach($readings as $reading){
                
                $rows = $this->db->get("id")->from("readings")->where("name", "=", $reading['name'])->execute()->fetchAll();
                
                foreach($rows as $row){
                    $this->db->delete()->from("readings")->where("id", "=", $row['id'])->execute();
                    $this->db->delete()->from("hiraganas")->where("reading_id", "=", $row['id'])->execute();
                    $this->db->delete()->from("romajis")->where("reading_id", "=", $row['id'])->execute();
                    $this->db->delete()->from("meanings")->where("reading_id", "=", $row['id'])->execute();
                    $this->db->delete()->from("examples")->where("reading_id", "=", $row['id'])->execute();
                    $this->db->delete()->from("belongs")->where("reading_id", "=", $row['id'])->execute();
                }
            }
        }

        $existing_readings = $this->db->get("readings.name", "name")->andGet("hiraganas.name", "hiragana")->from("readings")->innerjoin("hiraganas", "hiraganas.reading_id", "readings.id")->execute()->fetchAll();

        $already_exists=array();

        foreach($readings as $reading){

            if($this->reading_exists($reading, $existing_readings)){
                array_push($already_exists, $reading['name']);
            }
            else{
                $no_hiragana=preg_replace("/\p{Hiragana}/u", "", $reading['name']);
                $characters = preg_split("//u", $no_hiragana, -1, PREG_SPLIT_NO_EMPTY);

                foreach($characters as $character){
                    
                    $kanji = $this->db->get("id")->from("kanjis")->where("name", "=", $character)->execute();
                    $kanjiID = $kanji->fetchColumn();
                    
                    if($kanjiID==0) {
                        $this->db->insert("kanjis", array("name"))->values(array($character))->execute();
                        $kanjiID=$this->db->lastInsertId();
                    }
                    $this->db->insert("readings", array("kanji_id", "name"))->values(array($kanjiID, $reading['name']))->execute();
                    $readingID=$this->db->lastInsertId();
                    $this->db->insert("hiraganas", array("reading_id", "name"))->values(array($readingID, $reading['hiragana']))->execute();
                    $this->db->insert("romajis", array("reading_id", "name"))->values(array($readingID, $reading['romaji']))->execute();
                    $this->db->insert("meanings", array("reading_id", "name"))->values(array($readingID, $reading['meaning']))->execute();
                    $this->db->insert("examples", array("reading_id", "name"))->values(array($readingID, $reading['example']))->execute();

                    foreach($reading['categories'] as $category) $this->db->insert("belongs", array("reading_id", "cat_id"))->values(array($readingID, $category))->execute();
                }
            }

        }

        echo json_encode($already_exists);
    }
    
}