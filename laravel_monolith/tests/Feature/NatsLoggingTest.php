<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use App\Services\NatsService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Fakes\FakeNatsService;
use Tests\TestCase;
use Tests\Concerns\InteractsWithJwt;

class NatsLoggingTest extends TestCase
{
    use RefreshDatabase;
    use InteractsWithJwt;

    protected FakeNatsService $fakeNats;

    protected function setUp(): void
    {
        parent::setUp();
        $this->fakeNats = new FakeNatsService();
        $this->app->instance(NatsService::class, $this->fakeNats);
    }

    public function test_api_request_publishes_monolith_request_to_nats(): void
    {
        $author = User::factory()->create();
        Post::factory(2)->for($author)->create();

        $response = $this->getJson('/api/posts');

        $response->assertStatus(200);
        $this->assertCount(1, $this->fakeNats->published);

        $call = $this->fakeNats->published[0];
        $this->assertSame('monolith.request', $call['subject']);
        $this->assertSame('GET', $call['payload']['method']);
        $this->assertSame('api/posts', $call['payload']['path']);
        $this->assertSame(200, $call['payload']['status']);
        $this->assertArrayHasKey('timestamp', $call['payload']);
    }

    public function test_post_request_publishes_monolith_request_with_status_201(): void
    {
        $user = User::factory()->create();

        $response = $this->postJsonAs($user, '/api/posts', [
            'title' => 'New Post',
            'body' => 'Body content',
        ]);

        $response->assertStatus(201);
        $this->assertCount(1, $this->fakeNats->published);

        $call = $this->fakeNats->published[0];
        $this->assertSame('monolith.request', $call['subject']);
        $this->assertSame('POST', $call['payload']['method']);
        $this->assertSame(201, $call['payload']['status']);
        $this->assertArrayHasKey('path', $call['payload']);
        $this->assertArrayHasKey('timestamp', $call['payload']);
    }
}
