<?php

use App\Helpers\DB;

class Nexus
{

  public function insertDb($username, $password)
  {
    if ($this->validateAdmin($username, $password)) {
      DB::table('users')->insert([
        ['nexusUsername' => $username, 'nexusPassword' => $password]
      ]);
    } else {
      try{
        respond("Username or Password is incorrect", 201);
      }
      catch(Exception $e){
        respond($e->getMessage(),201);
      }
    }
  }

  public function validateAdmin($username, $password)
  {
    return 1;
  }
}
