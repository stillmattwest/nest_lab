<?php

namespace Tests\Unit;

use App\Models\Post;
use App\Models\User;
use App\Policies\PostPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostPolicyTest extends TestCase
{
    use RefreshDatabase;

    private PostPolicy $policy;

    private User $user;

    private Post $post;

    protected function setUp(): void
    {
        parent::setUp();
        $this->policy = new PostPolicy;
        $this->user = User::factory()->create();
        $this->post = Post::factory()->for($this->user)->create();
    }

    public function test_view_any_allows_guest(): void
    {
        $this->assertTrue($this->policy->viewAny(null));
    }

    public function test_view_allows_guest(): void
    {
        $this->assertTrue($this->policy->view(null, $this->post));
    }

    public function test_create_allows_authenticated_user(): void
    {
        $this->assertTrue($this->policy->create($this->user));
    }

    public function test_update_allows_owner(): void
    {
        $this->assertTrue($this->policy->update($this->user, $this->post));
    }

    public function test_update_denies_non_owner(): void
    {
        $other = User::factory()->create();
        $this->assertFalse($this->policy->update($other, $this->post));
    }

    public function test_delete_allows_owner(): void
    {
        $this->assertTrue($this->policy->delete($this->user, $this->post));
    }

    public function test_delete_denies_non_owner(): void
    {
        $other = User::factory()->create();
        $this->assertFalse($this->policy->delete($other, $this->post));
    }
}
