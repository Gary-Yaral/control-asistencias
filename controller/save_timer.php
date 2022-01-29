<?php 
    
    require_once('../model/Timer.php');

    $idFecha = uniqid('date_',true);
    $codigo = strval($_POST['userCode']);
    $cedula = strval($_POST['userID']);
    $nombre = strval($_POST['username']);
    $fecha = strval($_POST['date']);
    $horaEntrada = strval($_POST['hora_ingreso']);
    $horaSalida = strval($_POST['hora_salida']);

    $array = array($idFecha, $codigo, $cedula, $nombre,$fecha, $horaEntrada, $horaSalida);

    $timer = new Timer();
    $setFecha = array($codigo, $fecha);
    $result = $timer->searchRepetead($setFecha)->fetch();

    if($result === false) {
      if($timer ->insert($array)) {
        echo json_encode(true);
        return;
      }
      echo json_encode(['response'=> false, 'message'=> 'Error al ingresar asistencia']);
      return;
    }
    echo json_encode(['response'=> false, 'message'=> 'Ya existe una asistencia de esa fecha para ese trabajador']);

?>