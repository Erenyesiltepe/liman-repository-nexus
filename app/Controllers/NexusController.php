<?php

namespace App\Controllers;

use GuzzleHttp\Client;

class NexusController
{
  public function createRepo()
  {
    $body = request("data");
    $createtype = request("createtype");

    $client = new Client([
      'auth' => ['admin', 'password...']
    ]);

    $response = $client->post("http://10.151.43.147:8081/service/rest/v1/repositories/" . $createtype, [
      "headers" => [
        "Content-Type" => "application/json",
      ],
      "json" => $body
    ]);

    return $response->getBody();
  }
}
