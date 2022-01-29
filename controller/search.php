<?php 
    
    require_once('../model/Worker.php');


    $codigo = strval($_POST['userCode']);
    $worker = new Worker();
    $result = $worker->search($codigo)->fetch();

    echo json_encode($result);

?>