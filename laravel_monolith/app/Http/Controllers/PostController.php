<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PostController extends Controller
{
    /**
     * Display a listing of posts.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Post::query()->with('user');

        if ($request->has('user_id')) {
            $query->where('user_id', $request->integer('user_id'));
        }

        $posts = $query->latest()->paginate(15);

        return PostResource::collection($posts);
    }

    /**
     * Store a newly created post.
     */
    public function store(StorePostRequest $request): JsonResponse
    {
        $post = $request->user()->posts()->create($request->validated());
        $post->load('user');

        return response()->json(new PostResource($post), 201);
    }

    /**
     * Display the specified post.
     */
    public function show(Post $post): PostResource
    {
        $post->load('user');

        return new PostResource($post);
    }

    /**
     * Update the specified post.
     */
    public function update(UpdatePostRequest $request, Post $post): PostResource
    {
        $post->update($request->validated());
        $post->load('user');

        return new PostResource($post);
    }

    /**
     * Remove the specified post.
     */
    public function destroy(Post $post): JsonResponse
    {
        $this->authorize('delete', $post);
        $post->delete();

        return response()->json(null, 204);
    }
}
