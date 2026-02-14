<?php

namespace Tests\Concerns;

use App\Models\User;

trait InteractsWithJwt
{
    /**
     * Return a JWT for the given user (for Authorization: Bearer header).
     */
    protected function jwtFor(User $user): string
    {
        return auth('api')->login($user);
    }

    /**
     * Call a JSON API route as the given user (adds Bearer token).
     *
     * @param  array<string, mixed>  $data
     * @param  array<string, string>  $headers
     */
    protected function getJsonAs(User $user, string $uri, array $headers = []): \Illuminate\Testing\TestResponse
    {
        return $this->getJson($uri, array_merge($headers, [
            'Authorization' => 'Bearer ' . $this->jwtFor($user),
        ]));
    }

    /**
     * @param  array<string, mixed>  $data
     * @param  array<string, string>  $headers
     */
    protected function postJsonAs(User $user, string $uri, array $data = [], array $headers = []): \Illuminate\Testing\TestResponse
    {
        return $this->postJson($uri, $data, array_merge($headers, [
            'Authorization' => 'Bearer ' . $this->jwtFor($user),
        ]));
    }

    /**
     * @param  array<string, mixed>  $data
     * @param  array<string, string>  $headers
     */
    protected function putJsonAs(User $user, string $uri, array $data = [], array $headers = []): \Illuminate\Testing\TestResponse
    {
        return $this->putJson($uri, $data, array_merge($headers, [
            'Authorization' => 'Bearer ' . $this->jwtFor($user),
        ]));
    }

    /**
     * @param  array<string, mixed>  $data
     * @param  array<string, string>  $headers
     */
    protected function patchJsonAs(User $user, string $uri, array $data = [], array $headers = []): \Illuminate\Testing\TestResponse
    {
        return $this->patchJson($uri, $data, array_merge($headers, [
            'Authorization' => 'Bearer ' . $this->jwtFor($user),
        ]));
    }

    /**
     * @param  array<string, string>  $headers
     */
    protected function deleteJsonAs(User $user, string $uri, array $data = [], array $headers = []): \Illuminate\Testing\TestResponse
    {
        return $this->deleteJson($uri, $data, array_merge($headers, [
            'Authorization' => 'Bearer ' . $this->jwtFor($user),
        ]));
    }
}
