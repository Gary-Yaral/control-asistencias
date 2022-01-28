<?php 

  require_once('Connection.php');
  Class Worker extends Connection{
  
      private $newConnection;
  
    function __construct(){
      $this->newConnection = new Connection();
      $this->newConnection = $this->newConnection->getConnection();
    }

    public function insert(array $data){
    $query= "INSERT INTO `workers` (`codigo`,`cedula`, `nombres`, `apellidos`,`cargo`) VALUES (?, ?, ?, ?, ?);";	
    $statement = $this->newConnection->prepare($query);
    $statement->execute($data);
    return $statement;
    }

    public function getAll(){
      $query= "SELECT * FROM `workers`";	
      $statement = $this->newConnection->query($query);
      return $statement;
      
    }

    public function delete(string $codigo){
      $query= "DELETE FROM `workers` WHERE `codigo` = ?;";	
      $statement = $this->newConnection->prepare($query);
      $statement->execute(array($codigo));
      return $statement;
		}

    public function search(string $user){
			$query= "SELECT * FROM `workers` WHERE `codigo` = ? ";	
			$statement = $this->newConnection->prepare($query);
			$statement->execute(array($user));
			return $statement;
			
		}
  }

		/* public function search(string $user){
			$query= "SELECT * FROM `users` WHERE `user_id` = ? ";	
			$statement = $this->newConnection->prepare($query);
			$statement->execute(array($user));
			return $statement;
			
		}

		public function update(int $operationType, array $data){
			$query="";
			switch($operationType){
				case 0:
					$query= "UPDATE `users` SET `user_name` = ?, `user_lastname` = ?, `user_cellphone` = ?, `user_email` = ?, `user_business` = ?,  `user_address` = ? WHERE `users`.`user_id` = ?;";
					break;
				case 1:
					$query= "UPDATE `users` SET `user_name` = ?, `user_lastname` = ?, `user_cellphone` = ?, `user_email` = ?, `user_business` = ?,  `user_address` = ?, `user_image` = ? WHERE `users`.`user_id` = ?;";
					break;
				case 2:
					$query= "UPDATE `users` SET `user_id` = ?, `user_name` = ?, `user_lastname` = ?, `user_password` = ?, `user_cellphone` = ?, `user_email` = ?, `user_business` = ?,  `user_address` = ?, `user_image` = ? WHERE `users`.`user_id` = ?;";
					break;
				case 3:
					$query= "UPDATE `users` SET `user_id` = ?, `user_name` = ?, `user_lastname` = ?, `user_password` = ?, `user_cellphone` = ?, `user_email` = ?, `user_business` = ?,  `user_address` = ? WHERE `users`.`user_id` = ?;";
					break;
			}
			
			$statement = $this->newConnection->prepare($query);
			$statement->execute($data);
			return $statement;
		}

		public function updateImage(array $data){
			$query= "UPDATE `users` SET `user_image` = ? WHERE `users`.`user_id` = ?;";
			
			$statement = $this->newConnection->prepare($query);
			$statement->execute($data);
			return $statement;
		}

		public function delete(string $id){
			$query= "DELETE FROM `users` WHERE `user_id` = ?;";	
			$statement = $this->newConnection->prepare($query);
			$statement->execute(array($id));
			return $statement;
			
		}

		public function getAllUsersData(){
			$query= "SELECT * FROM `users`";	
			$statement = $this->newConnection->query($query);
			return $statement;
			
		}

		public function session(int $status, string $user){
			$query= "UPDATE `users` SET admin_status = ? WHERE `admin_id` =?";	
			$statement = $this->newConnection->prepare($query);
			$statement->execute(array($status, $user));
			return $statement;
		} */

?>