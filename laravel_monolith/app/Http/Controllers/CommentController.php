<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommentRequest;
use App\Http\Requests\UpdateCommentRequest;
use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CommentController extends Controller
{
    /**
     * Display a listing of comments for a post.
     */
    public function index(Post $post): AnonymousResourceCollection
    {
        $comments = $post->comments()->with('user')->latest()->get();

        return CommentResource::collection($comments);
    }

    /**
     * Store a newly created comment on a post.
     */
    public function store(StoreCommentRequest $request, Post $post): JsonResponse
    {
        $comment = $post->comments()->create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);
        $comment->load('user');

        return response()->json(new CommentResource($comment), 201);
    }

    /**
     * Display the specified comment.
     */
    public function show(Comment $comment): CommentResource
    {
        $comment->load(['user', 'post']);

        return new CommentResource($comment);
    }

    /**
     * Update the specified comment.
     */
    public function update(UpdateCommentRequest $request, Comment $comment): CommentResource
    {
        $comment->update($request->validated());
        $comment->load(['user', 'post']);

        return new CommentResource($comment);
    }

    /**
     * Remove the specified comment (author or post owner).
     */
    public function destroy(Comment $comment): JsonResponse
    {
        $this->authorize('delete', $comment);
        $comment->delete();

        return response()->json(null, 204);
    }
}
