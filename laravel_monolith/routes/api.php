<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

Route::get('/status', function () {
    try {
        // This confirms the "pipes" to Postgres are working
        DB::connection()->getPdo();
        
        return response()->json([
            'status' => 'success',
            'database' => 'connected',
            'engine' => 'PHP ' . PHP_VERSION,
            'timestamp' => now()->toDateTimeString(),
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Database connection failed: ' . $e->getMessage(),
        ], 500);
    }
});