<?php

return [
    "index" => "HomeController@index",
    "development" => "HomeController@development",

    // Request routes
    "apiProxy" => "RequestController@apiProxy",

    // Report routes
    "downloadReport" => "ReportController@downloadReport",
    "importReportTemplate" => "ReportController@importReportTemplate",
];
