<?php

namespace App\Controllers;

use Liman\Toolkit\Shell\Command;

class HomeController
{
	public function index()
	{
		Command::runSudo("usermod -a -G repository-server {:username}", [
			"username" => extensionDb("username")
		]);
		return view('index');
	}

	public function development()
	{
		return view('index_development');
	}

	function verify() {

		$result = executeOutsideCommand(
			"ssh",
			extensionDb("username"),
			extensionDb("password"),
			server()->ip_address,
			22,
			"echo verified"
		);
		
		if (trim($result) == "verified") {
			return "ok";
		} 

		return "SSH bağlantısı kurulamadı. Lütfen bilgilerinizi kontrol edin.";
	}
}
