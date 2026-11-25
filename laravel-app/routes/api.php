<?php

// Routes (like express.Router). Mounted with no prefix in bootstrap/app.php

use App\Http\Controllers\BookController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => ['message' => 'Hello from Laravel']); // arrays are sent as JSON

Route::get('/books', [BookController::class, 'index']);
Route::get('/books/{book}', [BookController::class, 'show']); // {book} = route parameter

// Routes inside this group run the "api.token" middleware first
Route::middleware('api.token')->group(function () {
    Route::post('/books', [BookController::class, 'store']);
    Route::put('/books/{book}', [BookController::class, 'update']);
    Route::delete('/books/{book}', [BookController::class, 'destroy']);
});

// Shortcut for all five routes above: Route::apiResource('books', BookController::class);

// Nothing matched -> 404 (like app.use(notFound))
Route::fallback(fn () => response()->json(['error' => 'Route not found'], 404));
