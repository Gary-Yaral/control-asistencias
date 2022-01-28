<?php

require_once('../model/Worker.php');

  $codigo = strval($_POST['codigo']);
  $worker = new Worker();
  if($worker->delete($codigo)) {
    echo json_encode(true);
  } else {
    echo json_encode(false);
  }

?>