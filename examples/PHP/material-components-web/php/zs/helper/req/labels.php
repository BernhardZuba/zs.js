<?php
namespace zs\helper\req;

class labels {
    private $db;

    public function __construct() {
        $this->db = new \zs\db\db();
    }

    public function getLabels($jsonIn, $userSession){
        $result = array();

        foreach($jsonIn->labels as $label) {
            $res = $this->db->query('SELECT text FROM labels WHERE lang = :lang AND name = :name LIMIT 1', 
                                    array('lang' => $jsonIn->language,
                                          'name' => $label));

            if($res->rowCount() == 0) {
                // Fallback to english
                $res = $this->db->query('SELECT text FROM labels WHERE lang = :lang AND name = :name LIMIT 1', 
                                    array('lang' => 'en',
                                          'name' => $label));
            }

            if($res->rowCount() > 0) {
                $res = $res->fetch(\PDO::FETCH_ASSOC);
                $result[strtolower($label)] = utf8_encode($res['text']);
            }
        };

        return array("labels" => $result);
    }
}
