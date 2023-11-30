<?php

namespace App\Controllers;
use GuzzleHttp\Client;
use App\Helpers\DB;
class RequestController
{
    const DSN = "mysql:host=localhost;dbname=ahbapol;port=3306;charset=utf8mb4" ;
    const USER = "root" ; 
    const PASSWORD = "" ;

    public function request($endpoint, $data, $type)
    {
        $request = getResponse(function ($client) use ($type, $endpoint, $data) {
            return $client->request(strtoupper($type), getUrl($endpoint), count($data) ? [
                'json' => $data
            ] : []);
        });

        return $request;
    }

    public function apiProxy()
    {
        validate([
            "type" => "required|in:get,post,put,patch,delete",
            "endpoint" => "required",
            "data" => "json"
        ]);
        $endpoint = request("endpoint");
        $data = json_decode(request("data") ? request("data") : "[]", true);
        $type = request("type");

        $request = getResponse(function ($client) use ($type, $endpoint, $data) {
            return $client->request(strtoupper($type), getUrl($endpoint), count($data) ? [
                'json' => $data
            ] : []);
        });

        return respond($request);
    }

    public function nexusProxy()
    {
        validate([
            "type" => "required|in:get,post,put,patch,delete",
            "endpoint" => "required",
            "data" => "json"
        ]);
        $endpoint = request("endpoint");
        $data = json_decode(request("data") ? request("data") : "[]", true);
        $type = request("type");
        $request = getResponse(
            function ($client) use ($type, $endpoint, $data) {
                return $client->request(strtoupper($type), getUrl($endpoint, "nexus"), count($data) ? [
                    'json' => $data,
                    "headers" => [
                        "Content-Type" => "application/json",
                      ],
                ] : []);
            },
            [
                'auth' => [
                    'admin',
                    '1'
                ],
            ]
        );

        return respond($request);
    }

    public function dbProxy()
    {
        validate([
            "type" => "required|in:get,insert",
            "data" => "json"
        ]);

        $data = json_decode(request("data") ? request("data") : "[]", true);
        $type = request("type");

        if($type=="insert"){
            try {
                DB::database()->table('users')->insert([
                    $data
                ]);
                return respond("Successfuly inserted into db");
              } catch (\Exception $e) {

             return respond('Caught exception: ' .  $e->getMessage(), "\n",201);
              }
        }
        else{
            try {
                $user=DB::database()->table("users")->where("name", "nexus")->first();
                return respond($user);
              } catch (\Exception $e) {
                return respond('Caught exception: ' .  $e->getMessage(). "\n",201);
              }
        }

    }
}