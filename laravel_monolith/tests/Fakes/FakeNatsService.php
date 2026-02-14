<?php

namespace Tests\Fakes;

use App\Services\NatsService;

class FakeNatsService extends NatsService
{
    /** @var array<int, array{subject: string, payload: array}> */
    public array $published = [];

    public function __construct()
    {
        // Do not call parent - avoids connecting to real NATS
    }

    public function publish(string $subject, array $payload): void
    {
        $this->published[] = [
            'subject' => $subject,
            'payload' => $payload,
        ];
    }

    public function clear(): void
    {
        $this->published = [];
    }
}
