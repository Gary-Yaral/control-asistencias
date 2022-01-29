<?php

require_once('../model/Timer.php');

  $codigo = strval($_POST['codigo']);
  $worker = new Timer();
  if($worker->delete($codigo)) {
    echo json_encode(true);
  } else {
    echo json_encode(false);
  }

?>