<?php

require_once('../model/Worker.php');

  $codigo = strval($_POST['codigo']);
  $worker = new Worker();
  try{
    if($worker->delete($codigo)) {
      echo json_encode(true);
    } 
  } catch (Exception $e) {
    echo json_encode(["response"=>false, "message" => "No es posible borrar este trabajador, porque tiene asistencias registradas con este código. Si desea eliminarlo, primero borre todas las asistencias registradas de este trabajador y luego intente de nuevo."]);
  }

?>