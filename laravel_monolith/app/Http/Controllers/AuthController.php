<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    /**
     * Register a new user and return a JWT.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::query()->create($request->validated());

        $token = auth('api')->login($user);
        $ttl = (int) config('jwt.ttl', 60);

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => $ttl * 60,
            'user' => new UserResource($user),
        ], 201);
    }

    /**
     * Login and return a JWT.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');

        if (! $token = auth('api')->attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $ttl = (int) config('jwt.ttl', 60);

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => $ttl * 60,
            'user' => new UserResource(auth('api')->user()),
        ]);
    }

    /**
     * Logout (invalidate the current token).
     */
    public function logout(): JsonResponse
    {
        auth('api')->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Get the authenticated user.
     */
    public function me(): JsonResponse
    {
        return response()->json([
            'user' => new UserResource(auth('api')->user()),
        ]);
    }

    /**
     * Update the authenticated user's profile.
     */
    public function update(UpdateUserRequest $request): JsonResponse
    {
        $user = auth('api')->user();
        $user->update($request->validated());

        return response()->json(['user' => new UserResource($user->fresh())]);
    }

    /**
     * Get the guard to be used (for testing / overrides).
     *
     * @return \Tymon\JWTAuth\JWTGuard
     */
    protected function guard()
    {
        return auth('api');
    }
}
