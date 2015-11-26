<?php

class FontController{
    
    private $rooter;
    private $controller;
    private $method;
    private $params;
    
    public function __construct(){
        $rooter = new Rooter();
        $this->controller = $rooter->get_controller();
        $this->method = $rooter->get_method();
        $this->params = $rooter->get_params();
    }
    
    public function run(){
        $app = new $this->controller();
        call_user_func_array(array($app, $this->method), array($this->params));
    }

    
}