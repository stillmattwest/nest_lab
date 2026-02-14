<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $userData = SeedContent::users();
        $users = [];

        foreach ($userData as $attrs) {
            $users[] = User::factory()->create([
                'name' => $attrs['name'],
                'email' => $attrs['email'],
                'password' => Hash::make('password'),
            ]);
        }

        $postData = SeedContent::posts();
        $posts = [];

        foreach ($postData as $index => $attrs) {
            $author = $users[$index % count($users)];
            $posts[] = Post::factory()->for($author)->create([
                'title' => $attrs['title'],
                'body' => $attrs['body'],
            ]);
        }

        $commentBodies = SeedContent::commentBodies();

        for ($i = 0; $i < 50; $i++) {
            $post = $posts[$i % count($posts)];
            $commenter = $users[$i % count($users)];
            $body = $commentBodies[$i % count($commentBodies)];

            Comment::factory()->for($commenter)->for($post)->create([
                'body' => $body,
            ]);
        }
    }
}
