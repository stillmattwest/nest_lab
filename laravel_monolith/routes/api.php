<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\PostController;
use App\Services\NatsService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

Route::get('/status', function (NatsService $nats) {
    try {
        // 1. Check Database
        DB::connection()->getPdo();
        
        $data = [
            'status' => 'success',
            'database' => 'connected',
            'engine' => 'PHP ' . PHP_VERSION,
            'timestamp' => now()->toIso8601String(),
        ];

        // 2. Broadcast to the Nervous System
        $nats->publish('monolith.status_checked', $data);

        return response()->json($data);

    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Monolith failure: ' . $e->getMessage(),
        ], 500);
    }
});

// Auth routes (throttled)
Route::middleware('throttle:api')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);
    Route::match(['put', 'patch'], '/user', [AuthController::class, 'update']);
});

// Posts: index and show are public; create/update/delete require auth + policy
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{post}', [PostController::class, 'show']);
Route::middleware('auth:api')->group(function () {
    Route::post('/posts', [PostController::class, 'store']);
    Route::match(['put', 'patch'], '/posts/{post}', [PostController::class, 'update']);
    Route::delete('/posts/{post}', [PostController::class, 'destroy']);
});

// Comments: index by post and show are public; create/update/delete require auth + policy (post owner can delete any comment on their post)
Route::get('/posts/{post}/comments', [CommentController::class, 'index']);
Route::get('/comments/{comment}', [CommentController::class, 'show']);
Route::middleware('auth:api')->group(function () {
    Route::post('/posts/{post}/comments', [CommentController::class, 'store']);
    Route::match(['put', 'patch'], '/comments/{comment}', [CommentController::class, 'update']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);
});