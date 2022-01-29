<?php 
    
    require_once('../model/Timer.php');

    $id_registro = strval($_POST['timerCode']);
    $actual_code = strval($_POST['actualCode']);
    $codigo = strval($_POST['type']);
    $cedula = strval($_POST['userID']);
    $nombres = strval($_POST['username']);
    $fecha = strval($_POST['date']);
    $hora_ingreso = strval($_POST['hora_ingreso']);
    $hora_salida = strval($_POST['hora_salida']);

    $array = array($codigo, $cedula, $nombres, $fecha, $hora_ingreso, $hora_salida, $id_registro);
    $timer = new Timer();

    if($actual_code === $codigo) {
      if($timer->update($array)) {
        echo json_encode(true);
        return;
      }
      echo json_encode(['response'=>false , 'message'=>'Ha ocurrido un error al ingresar datos.']);
      return;
    }

    $search = array($codigo, $fecha);
    $result = $timer->searchRepetead($search)->fetch();

    if($result === false) {
      if($timer->update($array)) {
        echo json_encode(true);
        return;
      }
      echo json_encode(['response'=>false , 'message'=>'Ha ocurrido un error al ingresar datos.']);
      return;
    }

    echo json_encode(['response'=> false, 'message'=>"Ya existe una asistencia con ese código y esa fecha."]);
    return;

?>