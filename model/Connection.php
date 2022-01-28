<?php

    class Connection{
        private $host = 'localhost';
        private $database = 'sw_asistencias';
        private $user = 'root';
        private $password = '';
        private $connection;

        function __construct(){
            try{
                $this->connection = "mysql:host=".$this->host.";dbname=".$this->database.";charset=utf8;";
                $this->connection = new PDO($this->connection, $this->user, $this->password);
                $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            }catch(Exception $e){
                return $e->getMessage();
            }
        }

        public function getConnection(){
            return $this->connection;
        }
    }

?>