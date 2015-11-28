<?php

class User{
    
    private $db;
    private $data;
    
    public function __construct(){
        
        session_start();
        $this->db = new Database();
        if(isset($_POST['user'])) $this->data = json_decode(json_encode($_POST['user']));
        
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
    
    public function create(){
        
        $progression = json_decode(json_encode($_POST['progression']));
        $favorites = json_decode(json_encode($_POST['favorites']));
        $existing_emails = $this->db->get("email")->from("users")->execute()->fetchAll();

        $i=0;
        $found=false;
        while($i<count($existing_emails) && !$found){
            if($existing_emails[$i]['email']==$this->data->email->value) $found=true;
            else $i++;
        }
        if(!$found){
            $this->db->insert("users", array("email", "username", "hash"))->values(array($this->data->email->value, $this->data->username->value, password_hash($this->data->password->value, PASSWORD_DEFAULT)))->execute();
            $userID = $this->db->lastInsertId();
            foreach($progression as $reading){
                $this->db->insert("progression", array("user_id", "type", "name", "value"))->values(array($userID, $reading->type, $reading->name, $reading->value))->execute();
            }
            foreach($favorites as $favorite){
                $this->db->insert("favorites", array("user_id", "reading_id"))->values(array($userID, $favorite->id));
            }
            $_SESSION['connected']=true;
            $_SESSION['user_id']=$userID;
            $_SESSION['email']=$this->data->email->value;
            $_SESSION['username']=$this->data->username->value;
            echo 200;
        } 
        else echo 400;
        
    }
    
    public function connect(){

        $existing_users = $this->db->get("*")->from("users")->execute()->fetchAll();
        
        $i=0;
        $valid=false;
        while($i<count($existing_users) && !$valid){
            if($existing_users[$i]['email']==$this->data->email && password_verify($this->data->password, $existing_users[$i]['hash'])) $valid=true;
            else $i++;
        }
        if($valid){
            $_SESSION['connected']=true;
            $_SESSION['user_id']=$existing_users[$i]['id'];
            $_SESSION['email']=$existing_users[$i]['email'];
            $_SESSION['username']=$existing_users[$i]['username'];
            echo 200;
        } 
        else echo 400;
    }
    
    public function session_data(){
        
        $session=new stdClass;
        if(isset($_SESSION['connected']) && $_SESSION['connected']==true){
            $session->user_id = $_SESSION['user_id'];
            $session->username = $_SESSION['username'];
            $session->status = 200;
        }
        else{
            $session->status = 400;
        }

        echo json_encode($session);
    }
    
    public function get_progression($userID){
        $rows = $this->db->get("type")->andGet("name")->andGet("value")->from("progression")->where("user_id", "=", $userID[0])->execute()->fetchAll();
        echo json_encode($rows);
    }
    
    public function update_progression(){
        
        $progression = json_decode(json_encode($_POST['progression']));
        $existing_progression = $this->db->get("*")->from("progression")->where("user_id", "=", $this->data->userID)->execute()->fetchAll();
        foreach($progression as $reading){
            $progressionID=$this->progression_exists($reading, $existing_progression);
            if($progressionID>=0) $this->db->update("progression")->set("value", $reading->value)->where("id", "=", $progressionID)->execute();
            else if($progressionID==-1 && $reading->value!="0") $this->db->insert("progression", array("user_id", "type", "name", "value"))->values(array($this->data->userID, $reading->type, $reading->name, $reading->value))->execute();
        }
        
    }
    
    private function progression_exists($reading, $progression){
        
        $i=0;
        $found=false;
        $same=false;
        $result=-1;
        while(!$found && $i<count($progression)){
            if($progression[$i]['name']==$reading->name && $progression[$i]['type']==$reading->type){
                if($progression[$i]['value']==$reading->value) $same=false;
                $found=true; 
            } 
            else $i++;
        }
        
        if($found) $result=$progression[$i]['id'];
        if($same) $result=-2;
        
        return $result;
    }
    
    public function get_fav($userID){
        
        $favorites = array();
        $rows = $this->db->get("favorites.reading_id", "id")->andGet("readings.name", "name")->andGet("hiraganas.name", "hiragana")->andGet("romajis.name", "romaji")->andGet("meanings.name", "meaning")->andGet("examples.name", "example")->from("favorites")->innerjoin("readings", "readings.id", "favorites.reading_id")->innerjoin("hiraganas", "hiraganas.reading_id", "favorites.reading_id")->innerjoin("romajis", "romajis.reading_id", "favorites.reading_id")->innerjoin("meanings", "meanings.reading_id", "favorites.reading_id")->innerjoin("examples", "examples.reading_id", "favorites.reading_id")->innerjoin("belongs", "belongs.reading_id", "favorites.reading_id")->where("favorites.user_id", "=", $userID[0])->execute();
        
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

            if(!$this->name_exists($object['name'], $favorites)) array_push($favorites, $object);

        }
        
        echo json_encode($favorites);
    }
    
    public function add_fav(){
        $readingID=$_POST['reading_id'];
        $this->db->insert("favorites", array("user_id", "reading_id"))->values(array($this->data->user_id, $readingID))->execute();
    }
    
    public function remove_fav(){
        $readingID=$_POST['reading_id'];
        $this->db->delete()->from("favorites")->where("user_id", "=", $this->data->user_id)->andWhere("reading_id", "=", $readingID)->execute();
    }
    
    public function logout(){
        session_destroy();
    }

}