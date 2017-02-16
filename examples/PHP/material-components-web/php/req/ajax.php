<?php
require_once('Autoloader.php');

$postData = file_get_contents("php://input");

$jsonIn = json_decode($postData);

if($jsonIn != null) {
    $jsonIn = $jsonIn->jsonReq;
    
    if($jsonIn != null) {
        $data = '';
        $obj = '';
        foreach($jsonIn as $input) {
            if($obj == '' && $input->o != '') {
                $obj = $input->o;
                $method = $input->m;
            }
            $data = $data.$input->d;
        }

        $dir = substr(__DIR__,0,strrpos(__DIR__, DIRECTORY_SEPARATOR));
        
        if($obj != null) {
            // Register your namespaces here:
            (new Autoloader())->registerNamespaces([
                'db' => $dir.DIRECTORY_SEPARATOR.'zs'.DIRECTORY_SEPARATOR.'db',
                'helper_req'  => $dir.DIRECTORY_SEPARATOR.'zs'.DIRECTORY_SEPARATOR.'helper'.DIRECTORY_SEPARATOR.'req',
                'user'  => $dir.DIRECTORY_SEPARATOR.'zs'.DIRECTORY_SEPARATOR.'user',
            ])->register();

            $userSession = new zs\user\session();

            $instance = new $obj();
            $jsonOut = $instance->{$method}(json_decode($data), $userSession);

            echo json_encode($jsonOut);
        }
    }
}
