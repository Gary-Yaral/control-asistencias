<?php

require_once('../model/Worker.php');
  $worker = new Worker();
  $all_workers = $worker->getAll()->fetchAll();
  echo json_encode($all_workers);
  
?>