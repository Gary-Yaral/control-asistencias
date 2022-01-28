<?php 
    
    require_once('../model/Worker.php');


    $codigo = strval($_POST['userCode']);
    $cedula = strval($_POST['userID']);
    $nombres = strval($_POST['username']);
    $apellidos = strval($_POST['lastname']);
    $cargo = strval($_POST['type']);

    $array = array($codigo, $cedula, $nombres, $apellidos, $cargo);

    $worker = new Worker();

    $result = $worker->search($codigo)->fetch();
    if($result !== false) {
      echo json_encode(['result'=>false, 'type'=>'repeated']);
      return;
    }

    if($worker ->insert($array)) {
      echo json_encode(true);
    } else {
      echo json_encode(false);
    }


    /* $ID = isset($_POST['userID']);
    $name = isset($_POST['username']);
    $lastname = isset($_POST['lastname']);
    $address = isset($_POST['address']); */

    /* if(ID)
    

        $ID = strval($_POST['user-id']);
        $pass = password_hash("USER_". $ID, PASSWORD_DEFAULT, array('cost'=> 10));
        $name = strval($_POST['user-names']);
        $lastname = strval($_POST['user-lastname']);
        $address = strval($_POST['user-address']);
        $cellphone = strval($_POST['user-cellphone']);
        $business = strval($_POST['user-business']);
        $email = strval($_POST['user-email']);
        $name_logo = strval($_FILES['user-logo']['name']);
        $tenant = uniqid("business_", true);
        $data = array();  
        $data[0] = $ID;
        $data[1] = $name;
        $data[2] = $lastname;
        $data[3] = $pass;
        $data[4] = $cellphone;
        $data[5] = $email;
        $data[6] = $business;
        $data[7] = $address;
        $data[8] = $name_logo;
        $data[9] = $tenant;

        $isRepeated = verifyRepeatedUser($ID) == true;
        if($isRepeated) return array("isRepeated" => true);
        $hasBeenSaved = sendData($data, $DIRECTORY);
        if($hasBeenSaved) return array("hasBeenSaved" => true);
        return array("hasBeenSaved" => false);
    
    }
          
    function sendData($data, $DIRECTORY){
        $user = new User();
        if($user->insert($data) && move_uploaded_file($_FILES['user-logo']['tmp_name'], $DIRECTORY.$data[8])){      
            return renameImageName($user, $data, $DIRECTORY);
        }else{
            return false;
        }
    } */
 

?>