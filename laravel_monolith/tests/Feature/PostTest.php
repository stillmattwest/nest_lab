<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\InteractsWithJwt;
use Tests\TestCase;

class PostTest extends TestCase
{
    use InteractsWithJwt;
    use RefreshDatabase;

    public function test_index_returns_paginated_posts(): void
    {
        $user = User::factory()->create();
        Post::factory(3)->for($user)->create();

        $response = $this->getJson('/api/posts');

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'links', 'meta']);
        $this->assertCount(3, $response->json('data'));
    }

    public function test_index_can_filter_by_user_id(): void
    {
        $author = User::factory()->create();
        $other = User::factory()->create();
        Post::factory(2)->for($author)->create();
        Post::factory(1)->for($other)->create();

        $response = $this->getJson('/api/posts?user_id=' . $author->id);

        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data'));
    }

    public function test_show_returns_post(): void
    {
        $post = Post::factory()->for(User::factory()->create())->create([
            'title' => 'Test Post',
            'body' => 'Body content',
        ]);

        $response = $this->getJson('/api/posts/' . $post->id);

        $response->assertStatus(200)
            ->assertJsonPath('data.title', 'Test Post')
            ->assertJsonPath('data.body', 'Body content');
    }

    public function test_show_returns_404_for_missing_post(): void
    {
        $this->getJson('/api/posts/99999')->assertStatus(404);
    }

    public function test_store_creates_post_when_authenticated(): void
    {
        $user = User::factory()->create();

        $response = $this->postJsonAs($user, '/api/posts', [
            'title' => 'New Post',
            'body' => 'New body',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('title', 'New Post')
            ->assertJsonPath('user_id', $user->id);

        $this->assertDatabaseHas('posts', [
            'title' => 'New Post',
            'user_id' => $user->id,
        ]);
    }

    public function test_store_requires_authentication(): void
    {
        $this->postJson('/api/posts', ['title' => 'T', 'body' => 'B'])
            ->assertStatus(401);
    }

    public function test_store_validates_required_fields(): void
    {
        $user = User::factory()->create();
        $this->postJsonAs($user, '/api/posts', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'body']);
    }

    public function test_update_allows_owner_to_update(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->for($user)->create(['title' => 'Original']);

        $response = $this->patchJsonAs($user, '/api/posts/' . $post->id, [
            'title' => 'Updated Title',
        ]);

        $response->assertStatus(200)->assertJsonPath('data.title', 'Updated Title');
        $post->refresh();
        $this->assertSame('Updated Title', $post->title);
    }

    public function test_update_denies_non_owner(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $post = Post::factory()->for($owner)->create(['title' => 'Original']);

        $response = $this->patchJsonAs($other, '/api/posts/' . $post->id, [
            'title' => 'Hacked',
        ]);

        $response->assertStatus(403);
        $post->refresh();
        $this->assertSame('Original', $post->title);
    }

    public function test_destroy_allows_owner_to_delete(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->for($user)->create();

        $response = $this->deleteJsonAs($user, '/api/posts/' . $post->id);

        $response->assertStatus(204);
        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
    }

    public function test_destroy_denies_non_owner(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $post = Post::factory()->for($owner)->create();

        $response = $this->deleteJsonAs($other, '/api/posts/' . $post->id);

        $response->assertStatus(403);
        $this->assertDatabaseHas('posts', ['id' => $post->id]);
    }
}
