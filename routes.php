<?php

return [
    "index" => "HomeController@index",
    "development" => "HomeController@development",
    "verify" => "HomeController@verify",

    // Request routes
    "apiProxy" => "RequestController@apiProxy",
    "nexusProxy" => "RequestController@nexusProxy",
    
    // Report routes
    "downloadReport" => "ReportController@downloadReport",
    "importReportTemplate" => "ReportController@importReportTemplate",
];
