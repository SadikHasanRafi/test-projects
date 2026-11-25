<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

// Protects a route: needs the header "Authorization: Bearer <API_TOKEN>"
// (A simple shared token. Real Laravel apps use Sanctum.)
class CheckApiToken
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->bearerToken() !== config('app.api_token')) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $next($request);
    }
}
