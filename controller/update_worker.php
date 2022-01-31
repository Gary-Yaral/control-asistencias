<?php 
    
    require_once('../model/Worker.php');
    $codigoOriginal = strval($_POST['original_code']);
    $codigo = strval($_POST['userCode']);
    $cedula = strval($_POST['userID']);
    $nombres = strval($_POST['username']);
    $apellidos = strval($_POST['lastname']);
    $cargo = strval($_POST['type']);

    $array = array($codigo, $cedula, $nombres, $apellidos, $cargo, $codigoOriginal);

    if($codigoOriginal === $codigo) {
      $worker = new Worker();
      if($worker->update($array)) {
        echo json_encode(true);
      }
      return;
    }

    if($codigoOriginal !== $codigo) {
      $worker = new Worker();
      $result = $worker->search($codigo)->fetch();
      if($result === false) {
        if($worker->update($array)) {
          echo json_encode(true);
          return;
        }
        echo json_encode(['response'=>false , 'message'=>'Ha ocurrido un error al ingresar datos.']);
        return;
      }
      echo json_encode(['response'=>false , 'message'=>'Ya existe un usuario con el código '.$codigo.', por favor escriba otro código']);
      return;
    }

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