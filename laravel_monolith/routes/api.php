<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Services\NatsService;

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