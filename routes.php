<?php

return [
    "index" => "HomeController@index",
    "development" => "HomeController@development",
    "verify" => "HomeController@verify",

    // Request routes
    "apiProxy" => "RequestController@apiProxy",
    "nexusProxy" => "RequestController@nexusProxy",
    "dbProxy" => "RequestController@dbProxy",
    "dbInsert" => "RequestController@dbInsert",
    "dbGet" => "RequestController@dbGet",
    
    // Report routes
    "downloadReport" => "ReportController@downloadReport",
    "importReportTemplate" => "ReportController@importReportTemplate",
];
