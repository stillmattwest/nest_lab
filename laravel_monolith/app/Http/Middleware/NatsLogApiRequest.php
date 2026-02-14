<?php

namespace App\Http\Middleware;

use App\Services\NatsService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class NatsLogApiRequest
{
    public function __construct(
        protected NatsService $nats
    ) {}

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }

    /**
     * After the response is sent, publish request/response summary to NATS.
     */
    public function terminate(Request $request, Response $response): void
    {
        $this->nats->publish('monolith.request', [
            'method' => $request->method(),
            'path' => $request->path(),
            'status' => $response->getStatusCode(),
            'timestamp' => now()->toIso8601String(),
        ]);
    }
}
