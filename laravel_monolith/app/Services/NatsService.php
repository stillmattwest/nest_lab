<?php

namespace App\Services;

use Basis\Nats\Client;
use Basis\Nats\Configuration;

class NatsService
{
    protected Client $client;

    public function __construct()
    {
        // Use the service name 'nats' from your docker-compose
        $config = new Configuration([
            'host' => 'nats',
            'port' => 4222,
        ]);

        $this->client = new Client($config);
    }

    public function publish(string $subject, array $payload): void
    {
        try {
            $this->client->publish($subject, $payload);
        } catch (\Exception $e) {
            \Log::error("NATS Broadcast Failed: " . $e->getMessage());
        }
    }
}