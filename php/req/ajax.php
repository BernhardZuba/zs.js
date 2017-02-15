<?php

$postData = file_get_contents("php://input");

$jsonIn = json_decode($postData);

if($jsonIn != null) {

    $jsonIn = $jsonIn->jsonReq;
    
    if($jsonIn != null) {
        //var_dump($jsonIn);
        $jsonIn = $jsonIn[0];
        //var_dump($jsonIn);
        
        $obj = $jsonIn->o;
        $method = $jsonIn->m;
        //echo $obj.' '.$method.'<br>';

        if($obj != null) {
            require_once(str_replace("\\","/",$obj).'.php');
            
            $instance = new $obj();
            $jsonOut = $instance->{$method}();
            
            echo json_encode($jsonOut);
        }
    }
}
