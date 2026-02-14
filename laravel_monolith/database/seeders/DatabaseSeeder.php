<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $posts = Post::factory(3)->for($user)->create();

        foreach ($posts as $post) {
            Comment::factory(2)->for($user)->for($post)->create();
        }

        // One more user with a comment on the first post (to test post-owner delete)
        $otherUser = User::factory()->create([
            'name' => 'Other User',
            'email' => 'other@example.com',
        ]);
        Comment::factory()->for($otherUser)->for($posts[0])->create([
            'body' => 'A comment from another user on the first post.',
        ]);
    }
}
