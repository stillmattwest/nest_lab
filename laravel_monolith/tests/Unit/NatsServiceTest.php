<?php

namespace Tests\Unit;

use Tests\Fakes\FakeNatsService;
use Tests\TestCase;

class NatsServiceTest extends TestCase
{
    public function test_fake_records_publish_calls(): void
    {
        $fake = new FakeNatsService();

        $fake->publish('monolith.status_checked', [
            'status' => 'success',
            'database' => 'connected',
        ]);
        $fake->publish('monolith.request', [
            'method' => 'GET',
            'path' => 'api/posts',
            'status' => 200,
            'timestamp' => '2024-01-01T00:00:00+00:00',
        ]);

        $this->assertCount(2, $fake->published);

        $this->assertSame('monolith.status_checked', $fake->published[0]['subject']);
        $this->assertSame('success', $fake->published[0]['payload']['status']);
        $this->assertSame('connected', $fake->published[0]['payload']['database']);

        $this->assertSame('monolith.request', $fake->published[1]['subject']);
        $this->assertSame('GET', $fake->published[1]['payload']['method']);
        $this->assertSame('api/posts', $fake->published[1]['payload']['path']);
        $this->assertSame(200, $fake->published[1]['payload']['status']);
    }

    public function test_fake_clear_resets_published(): void
    {
        $fake = new FakeNatsService();
        $fake->publish('test', []);
        $this->assertCount(1, $fake->published);

        $fake->clear();
        $this->assertCount(0, $fake->published);
    }
}
