<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

// Logs: GET /books 200 3ms   (written to storage/logs/laravel.log, watch it with `php artisan pail`)
class LogRequest
{
    public function handle(Request $request, Closure $next): Response
    {
        $start = microtime(true);

        $response = $next($request); // like next() in Express, but it returns the response

        $ms = round((microtime(true) - $start) * 1000);
        Log::info("{$request->method()} {$request->getRequestUri()} {$response->getStatusCode()} {$ms}ms");

        return $response;
    }
}
