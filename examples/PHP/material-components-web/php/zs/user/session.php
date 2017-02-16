<?php

namespace zs\user;

class session {
    private $id;
    private $email;
    
    public function setID($id) {
        $this->id = $id;
    }
    
    public function setMail($email) {
        $this->email = $email;
    }
    
    public function getID() {
        return $this->id = $id;
    }
    
    public function getMail() {
        return $this->email;
    }
}