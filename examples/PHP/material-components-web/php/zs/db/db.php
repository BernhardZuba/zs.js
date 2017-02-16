<?php
namespace zs\db;

class db {
    private $conn;
    
    public function __construct(){
        $servername = "localhost";
        $username = "root"; // TODO username
        $password = "root"; // TODO password

        try {                                                     // TODO dbname
            $this->conn = new \PDO("mysql:host=$servername;dbname=databaseName", $username, $password);
            // set the PDO error mode to exception
            $this->conn->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);

        } catch(\PDOException $e) {
            echo "Connection failed: " . $e->getMessage();
        }
    }
    
    public function query($query, $arr){
        $stmt = $this->conn->prepare($query);
        $stmt->execute($arr);
        
        return $stmt;
    }
    
    public function insert($query, $arr){
        $stmt = $this->conn->prepare($query);
        $result = $stmt->execute($arr);

        return $result;
    }
}