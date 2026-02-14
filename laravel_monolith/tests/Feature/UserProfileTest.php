<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\InteractsWithJwt;
use Tests\TestCase;

class UserProfileTest extends TestCase
{
    use InteractsWithJwt;
    use RefreshDatabase;

    public function test_update_profile_updates_name_and_email(): void
    {
        $user = User::factory()->create(['name' => 'Old', 'email' => 'old@example.com']);

        $response = $this->patchJsonAs($user, '/api/user', [
            'name' => 'New Name',
            'email' => 'new@example.com',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('user.name', 'New Name')
            ->assertJsonPath('user.email', 'new@example.com');

        $user->refresh();
        $this->assertSame('New Name', $user->name);
        $this->assertSame('new@example.com', $user->email);
    }

    public function test_update_profile_validates_email_uniqueness(): void
    {
        User::factory()->create(['email' => 'taken@example.com']);
        $user = User::factory()->create(['email' => 'me@example.com']);

        $response = $this->patchJsonAs($user, '/api/user', [
            'email' => 'taken@example.com',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors(['email']);
    }

    public function test_update_profile_allows_same_email_for_current_user(): void
    {
        $user = User::factory()->create(['name' => 'Me', 'email' => 'me@example.com']);

        $response = $this->patchJsonAs($user, '/api/user', [
            'name' => 'Updated Me',
        ]);

        $response->assertStatus(200)->assertJsonPath('user.email', 'me@example.com');
    }

    public function test_update_profile_requires_authentication(): void
    {
        $this->patchJson('/api/user', ['name' => 'Foo'])->assertStatus(401);
    }
}
