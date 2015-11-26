<?php

class Database{
    
    private $db;
    private $query;
    private $result;
    
    public function __construct(){
        $this->db = new PDO('mysql:host='.HOST.';dbname='.DBNAME, USER, PASSWORD, array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'));
    }
   
    public function get($columnname, $as=null){
        $this->query = "SELECT ".$columnname;
        if(!empty($as)){
            $this->query .= " AS ".$as;
        }
        return $this;
    }
    
    public function andGet($columname, $as=null){
        $this->query .= ", ".$columname;
        if(!empty($as)){
            $this->query .= " AS ".$as;
        }
        return $this;
    }
    
    public function insert($table, $columns){
        $this->query = "INSERT INTO ".$table."(";
        $i=0;
        $len=count($columns);
        for($i=0; $i<$len; $i++){
            $this->query .= $columns[$i];
            if($i!=$len-1) $this->query .= ", ";
        }
        $this->query .= ")";
        return $this;
    }
    
    public function values($values){
        $this->query .= " VALUES(";
        $i=0;
        $len=count($values);
        for($i=0; $i<$len; $i++){
            $this->query .= "'".$values[$i]."'";
            if($i!=$len-1) $this->query .= ", ";
        }
        $this->query .= ");";
        return $this;
    }
    
    public function delete(){
        $this->query = "DELETE";
        return $this;
    }
    
    public function update($table){
        $this->query = "UPDATE ".$table;
        return $this;
    }
    
    public function set($element1, $element2){
        $this->query .= " SET ".$element1."=".$element2;
        return $this;
    }
    
    public function andSet($element1, $element2){
        $this->query .= ", SET ".$element1."=".$element2;
        return $this;
    }
    
    public function from($tablename){
        $this->query .= " FROM ".$tablename;
        return $this;
    }
    
    public function innerjoin($tablename, $element1, $element2){
        if(!empty($tablename) && !empty($element1) && !empty($element2))
            $this->query .= " INNER JOIN ".$tablename." ON ".$element1."=".$element2;
        return $this;
    }
    
    public function where($element1, $operator, $element2){
        if(!empty($element1) && !empty($operator) && !empty($element2))
            $this->query .= " WHERE ".$element1." ".$operator." '".$element2."'";
        return $this;
    }
    
    public function andWhere($element1, $operator, $element2){
        if(!empty($element1) && !empty($operator) && !empty($element2))
            $this->query .= " AND ".$element1." ".$operator." '".$element2."'";
        return $this;
    }
    
    public function lastInsertId(){
        return $this->db->lastInsertId();
    }
    
    public function execute(){
        $this->result = $this->db->query($this->query);
        return $this->result;
    }
    
}