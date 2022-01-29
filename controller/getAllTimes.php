<?php

require_once('../model/Timer.php');
  $timer = new Timer();
  $all_timers = $timer->getAll()->fetchAll();
  echo json_encode($all_timers);
  
?>