<?php

namespace Tests\Unit;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use App\Policies\CommentPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommentPolicyTest extends TestCase
{
    use RefreshDatabase;

    private CommentPolicy $policy;

    protected function setUp(): void
    {
        parent::setUp();
        $this->policy = new CommentPolicy;
    }

    public function test_view_any_allows_guest(): void
    {
        $this->assertTrue($this->policy->viewAny(null));
    }

    public function test_view_allows_guest(): void
    {
        $comment = Comment::factory()
            ->for(Post::factory()->for(User::factory()->create()))
            ->for(User::factory()->create())
            ->create();
        $this->assertTrue($this->policy->view(null, $comment));
    }

    public function test_create_allows_authenticated_user(): void
    {
        $user = User::factory()->create();
        $this->assertTrue($this->policy->create($user));
    }

    public function test_update_allows_comment_author(): void
    {
        $author = User::factory()->create();
        $comment = Comment::factory()
            ->for(Post::factory()->for(User::factory()->create()))
            ->for($author)
            ->create();
        $this->assertTrue($this->policy->update($author, $comment));
    }

    public function test_update_denies_non_author(): void
    {
        $author = User::factory()->create();
        $other = User::factory()->create();
        $comment = Comment::factory()
            ->for(Post::factory()->for(User::factory()->create()))
            ->for($author)
            ->create();
        $this->assertFalse($this->policy->update($other, $comment));
    }

    public function test_delete_allows_comment_author(): void
    {
        $author = User::factory()->create();
        $comment = Comment::factory()
            ->for(Post::factory()->for(User::factory()->create()))
            ->for($author)
            ->create();
        $this->assertTrue($this->policy->delete($author, $comment));
    }

    public function test_delete_allows_post_owner(): void
    {
        $postOwner = User::factory()->create();
        $commentAuthor = User::factory()->create();
        $post = Post::factory()->for($postOwner)->create();
        $comment = Comment::factory()->for($post)->for($commentAuthor)->create();

        $this->assertTrue($this->policy->delete($postOwner, $comment));
    }

    public function test_delete_denies_user_who_is_neither_author_nor_post_owner(): void
    {
        $postOwner = User::factory()->create();
        $commentAuthor = User::factory()->create();
        $other = User::factory()->create();
        $post = Post::factory()->for($postOwner)->create();
        $comment = Comment::factory()->for($post)->for($commentAuthor)->create();

        $this->assertFalse($this->policy->delete($other, $comment));
    }
}
