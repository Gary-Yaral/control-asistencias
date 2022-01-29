<?php 

  require_once('Connection.php');
  Class Timer extends Connection{
  
      private $newConnection;
  
    function __construct(){
      $this->newConnection = new Connection();
      $this->newConnection = $this->newConnection->getConnection();
    }

    public function insert(array $data){
    $query= "INSERT INTO `timers` (`codigo`,`cedula`, `nombre`,`fecha`, `hora_entrada`, `hora_salida`) VALUES (?, ?, ?, ?, ?, ?);";	
    $statement = $this->newConnection->prepare($query);
    $statement->execute($data);
    return $statement;
    }

    public function getAll(){
      $query= "SELECT * FROM `timers`";	
      $statement = $this->newConnection->query($query);
      return $statement;
      
    }

    public function delete(string $codigo){
      $query= "DELETE FROM `timers` WHERE `codigo` = ?;";	
      $statement = $this->newConnection->prepare($query);
      $statement->execute(array($codigo));
      return $statement;
		}

    public function search(string $user){
			$query= "SELECT * FROM `timers` WHERE `codigo` = ? ";	
			$statement = $this->newConnection->prepare($query);
			$statement->execute(array($user));
			return $statement;			
		}

    public function update(array $data){
			$query= "UPDATE `workers` SET `codigo` = ?,`cedula` = ?, `nombres` = ?, `apellidos` = ?,`cargo` = ? WHERE `codigo` = ?;";		
			$statement = $this->newConnection->prepare($query);
			$statement->execute($data);
			return $statement;
		}
  }

?>