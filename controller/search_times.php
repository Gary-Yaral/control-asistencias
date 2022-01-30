<?php 
    
    require_once('../model/Timer.php');

    $fechaInicial = strval($_POST['fecha_inicial']);
    $fechafinal = strval($_POST['fecha_final']);
    $array = array($fechaInicial, $fechafinal);
    $timer = new Timer();
    $result = $timer->searchDates($array)->fetchAll();

    echo json_encode($result);

?>