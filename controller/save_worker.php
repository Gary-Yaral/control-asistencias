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

?>