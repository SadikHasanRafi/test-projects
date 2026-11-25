<?php

// The app's "app.js": routing, middleware and error handling are configured here.

use App\Http\Middleware\CheckApiToken;
use App\Http\Middleware\LogRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        apiPrefix: '', // Laravel adds "/api" to API routes by default. We want /books
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Global middleware: runs on every request (like app.use)
        $middleware->append(LogRequest::class);

        // Route middleware: give it a short name, use it in routes/api.php
        $middleware->alias(['api.token' => CheckApiToken::class]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Always answer errors with JSON (this is an API)
        $exceptions->shouldRenderJsonWhen(fn () => true);

        // Route model binding found no row -> custom 404 message
        $exceptions->render(function (NotFoundHttpException $e) {
            if ($e->getPrevious() instanceof ModelNotFoundException) {
                return response()->json(['error' => 'Book not found'], 404);
            }
        });
    })->create();
