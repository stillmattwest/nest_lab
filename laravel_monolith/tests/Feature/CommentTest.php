<?php

namespace Tests\Feature;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\InteractsWithJwt;
use Tests\TestCase;

class CommentTest extends TestCase
{
    use InteractsWithJwt;
    use RefreshDatabase;

    public function test_index_returns_comments_for_post(): void
    {
        $post = Post::factory()->for(User::factory()->create())->create();
        Comment::factory(2)->for($post)->for(User::factory()->create())->create();

        $response = $this->getJson('/api/posts/' . $post->id . '/comments');

        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data'));
    }

    public function test_show_returns_comment(): void
    {
        $comment = Comment::factory()
            ->for(Post::factory()->for(User::factory()->create()))
            ->for(User::factory()->create())
            ->create(['body' => 'Comment body']);

        $response = $this->getJson('/api/comments/' . $comment->id);

        $response->assertStatus(200)->assertJsonPath('data.body', 'Comment body');
    }

    public function test_store_creates_comment_when_authenticated(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->for(User::factory()->create())->create();

        $response = $this->postJsonAs($user, '/api/posts/' . $post->id . '/comments', [
            'body' => 'My comment',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('body', 'My comment')
            ->assertJsonPath('user_id', $user->id)
            ->assertJsonPath('post_id', $post->id);

        $this->assertDatabaseHas('comments', [
            'body' => 'My comment',
            'user_id' => $user->id,
            'post_id' => $post->id,
        ]);
    }

    public function test_store_requires_authentication(): void
    {
        $post = Post::factory()->for(User::factory()->create())->create();
        $this->postJson('/api/posts/' . $post->id . '/comments', ['body' => 'Hi'])
            ->assertStatus(401);
    }

    public function test_update_allows_comment_author(): void
    {
        $user = User::factory()->create();
        $comment = Comment::factory()
            ->for(Post::factory()->for(User::factory()->create()))
            ->for($user)
            ->create(['body' => 'Original']);

        $response = $this->patchJsonAs($user, '/api/comments/' . $comment->id, [
            'body' => 'Updated body',
        ]);

        $response->assertStatus(200)->assertJsonPath('data.body', 'Updated body');
    }

    public function test_update_denies_non_author(): void
    {
        $author = User::factory()->create();
        $other = User::factory()->create();
        $comment = Comment::factory()
            ->for(Post::factory()->for(User::factory()->create()))
            ->for($author)
            ->create(['body' => 'Original']);

        $response = $this->patchJsonAs($other, '/api/comments/' . $comment->id, [
            'body' => 'Hacked',
        ]);

        $response->assertStatus(403);
        $comment->refresh();
        $this->assertSame('Original', $comment->body);
    }

    public function test_destroy_allows_comment_author(): void
    {
        $user = User::factory()->create();
        $comment = Comment::factory()
            ->for(Post::factory()->for(User::factory()->create()))
            ->for($user)
            ->create();

        $response = $this->deleteJsonAs($user, '/api/comments/' . $comment->id);

        $response->assertStatus(204);
        $this->assertDatabaseMissing('comments', ['id' => $comment->id]);
    }

    public function test_destroy_allows_post_owner_to_delete_any_comment_on_their_post(): void
    {
        $postOwner = User::factory()->create();
        $commentAuthor = User::factory()->create();
        $post = Post::factory()->for($postOwner)->create();
        $comment = Comment::factory()->for($post)->for($commentAuthor)->create();

        $response = $this->deleteJsonAs($postOwner, '/api/comments/' . $comment->id);

        $response->assertStatus(204);
        $this->assertDatabaseMissing('comments', ['id' => $comment->id]);
    }

    public function test_destroy_denies_user_who_is_neither_author_nor_post_owner(): void
    {
        $postOwner = User::factory()->create();
        $commentAuthor = User::factory()->create();
        $other = User::factory()->create();
        $post = Post::factory()->for($postOwner)->create();
        $comment = Comment::factory()->for($post)->for($commentAuthor)->create();

        $response = $this->deleteJsonAs($other, '/api/comments/' . $comment->id);

        $response->assertStatus(403);
        $this->assertDatabaseHas('comments', ['id' => $comment->id]);
    }
}
