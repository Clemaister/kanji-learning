<?php

class Rooter{
    
    private $controller;
    private $method;
    private $params;
    
    public function __construct(){
        $base = API_BASE;
        $url = parse_url($_SERVER['REQUEST_URI'])['path'];
        $url = str_replace($base, "", $url);
        preg_match_all("/\/(.*?)\/(.*?)\/(.*?)$/", $url, $matches);
    
        if(count($matches[1])!=0){
            $this->controller=$matches[1][0];
            $this->method=$matches[2][0];
            $this->params=array($matches[3][0]);
        }
        else{
            preg_match_all("/\/(.*?)\/(.*?)$/", $url, $matches);
            $this->controller=$matches[1][0];
            $this->method=$matches[2][0];
            $this->params=array();
        }
        
    }

    public function get_controller(){
        return $this->controller;
    }
    
    public function get_method(){
        return $this->method;
    }
    
    public function get_params(){
        return $this->params;
    }
    
}