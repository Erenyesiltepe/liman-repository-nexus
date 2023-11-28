<?php
namespace App\Helpers;

use Illuminate\Container\Container;
use Illuminate\Database\Events\StatementPrepared;
use Illuminate\Events\Dispatcher;
use PDO;

class DB
{
	private static $customContainer;
	private static $capsule;
	private static $initialized = false;

	public static function init()
	{
		self::$customContainer = new Container();
		self::$capsule = new self(self::$customContainer);
		self::$capsule->addConnection([
			'driver' => 'pgsql',
			'port' => extensionDb('postgrePort'),
			'host' => extensionDb('postgreHost'),
			'username' => extensionDb('postgreUsername'),
			'password' => extensionDb('postgrePassword'),
			'charset' => 'utf8',
			'collation' => 'utf8_unicode_ci',
			'prefix' => ''
		]);
		self::$capsule->setEventDispatcher($dispatcher = new Dispatcher());
		$dispatcher->listen(StatementPrepared::class, function ($event) {
			$event->statement->setFetchMode(PDO::FETCH_ASSOC);
		});
		self::$capsule->setAsGlobal();
		self::$initialized = true;
	}

	public static function database(string $dbName)
	{
		if (!self::$initialized) {
			self::init();
		}
		$connections = self::$customContainer['config']['database.connections'];
		$connections['default']['database'] = $dbName;
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

	public function langPath(){}
	public function publicPath(){}
	public function hasDebugModeEnabled(){}
}
