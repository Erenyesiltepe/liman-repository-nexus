<?php

use App\Helpers\DB;

class MyDbController
{
  public function dbInsert($username, $password)
  {
    try {
      DB::table('users')->insert([
        ['nexusUsername' => $username, 'nexusPassword' => $password]
      ]);
      respond("Successfuly inserted into db");
    } catch (Exception $e) {
      respond('Caught exception: ' .  $e->getMessage(), "\n");
    }
  }

  public function dbGet()
  {
    try {
      $user=DB::table('user')->get();
      respond($user);
    } catch (Exception $e) {
      respond('Caught exception: ' .  $e->getMessage(), "\n");
    }
  }
}
