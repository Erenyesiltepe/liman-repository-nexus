<?php

namespace App\Helpers;

use Illuminate\Container\Container;
use Illuminate\Database\Capsule\Manager as Capsule;

class DB extends Capsule
{
    private static $customContainer;
    private static $capsule;
    private static $initialized = false;

    public static function init()
    {
        $localPort = openTunnel(
            '127.0.0.1',
            5432,
            'liman',
            '1'
        );

        self::$customContainer = new Container();
        self::$capsule = new self(self::$customContainer);
        self::$capsule->addConnection([
            'driver' => 'pgsql',
            'port' => $localPort,
            'host' => '127.0.0.1',
            'username' => 'root',
            'password' => '',
            'charset' => 'utf8',
            'collation' => 'utf8_unicode_ci',
            'prefix' => ''
        ]);
        dd("in dbcontrol". $localPort);
        self::$capsule->setAsGlobal();
        self::$initialized = true;
    }

    public static function database()
    {
        if (!self::$initialized) {
            self::init();
        }
        $connections = self::$customContainer['config']['database.connections'];
        $connections['default']['database'] = extensionDb('database_name');
        self::$customContainer['config']['database.connections'] = $connections;
        return self::$capsule;
    }

    public function __call($method, $parameters)
    {
        return self::$capsule::connection()->$method(...$parameters);
    }

    public static function __callStatic($method, $parameters)
    {
        return self::$capsule::connection()->$method(...$parameters);
    }
}