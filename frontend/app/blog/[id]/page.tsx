'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import {
  getPost,
  getComments,
  createComment,
  updateComment,
  deleteComment,
  deletePost,
} from '@/lib/api';
import type { Post, Comment } from '@/lib/types';
import { CommentList } from '@/components/CommentList';
import { CommentForm } from '@/components/CommentForm';
import { useAuth } from '@/contexts/AuthContext';

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [deletingComment, setDeletingComment] = useState<Comment | null>(null);
  const [deletingPost, setDeletingPost] = useState(false);

  const loadComments = useCallback(async () => {
    if (!id) return;
    const res = await getComments(id);
    if (res.data?.data) {
      setComments(res.data.data);
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([getPost(id), getComments(id)])
      .then(([postRes, commentsRes]) => {
        if (cancelled) return;
        if (postRes.error) {
          setError(postRes.error.message ?? 'Post not found');
          setPost(null);
          setComments([]);
        } else {
          if (postRes.data) setPost(postRes.data);
          if (commentsRes.data?.data) setComments(commentsRes.data.data);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleAddComment = async (body: string) => {
    if (!id) return;
    const res = await createComment(id, { body });
    if (res.error) throw new Error(res.error.message ?? 'Failed to add comment');
    await loadComments();
  };

  const handleEditComment = async (body: string) => {
    if (!editingComment) return;
    const res = await updateComment(editingComment.id, { body });
    if (res.error) throw new Error(res.error.message ?? 'Failed to update comment');
    setEditingComment(null);
    await loadComments();
  };

  const handleDeleteComment = async (comment: Comment) => {
    const res = await deleteComment(comment.id);
    if (res.error) throw new Error(res.error.message ?? 'Failed to delete comment');
    setDeletingComment(null);
    await loadComments();
  };

  const handleDeletePost = async () => {
    if (!id || !post) return;
    const res = await deletePost(id);
    if (res.error) throw new Error(res.error.message ?? 'Failed to delete post');
    setDeletingPost(false);
    router.push('/blog');
  };

  const isOwner = user && post && user.id === post.user_id;

  if (!id) {
    return (
      <Typography color="error">Invalid post ID.</Typography>
    );
  }

  if (loading && !post) {
    return (
      <Box className="py-8">
        <Typography color="text.secondary">Loading…</Typography>
      </Box>
    );
  }

  if (error || !post) {
    return (
      <Box className="py-8">
        <Typography color="error">{error ?? 'Post not found.'}</Typography>
        <Button component={Link} href="/blog" sx={{ mt: 2 }}>
          Back to blog
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="overline" color="text.secondary">
        {post.user?.name ?? 'Unknown'} · {formatDate(post.created_at)}
      </Typography>
      <Box className="flex items-start justify-between gap-4 flex-wrap">
        <Typography component="h1" variant="h4" fontWeight={600} sx={{ flex: 1 }}>
          {post.title}
        </Typography>
        {isOwner && (
          <Box className="flex gap-0">
            <IconButton
              component={Link}
              href={`/blog/${id}/edit`}
              aria-label="Edit post"
              size="small"
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              aria-label="Delete post"
              size="small"
              onClick={() => setDeletingPost(true)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>
      <Divider sx={{ my: 2 }} />
      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
        {post.body}
      </Typography>

      <Typography variant="h6" fontWeight={600} sx={{ mt: 4, mb: 2 }}>
        Comments
      </Typography>
      {editingComment ? (
        <Box sx={{ mb: 2 }}>
          <CommentForm
            initialBody={editingComment.body}
            submitLabel="Save"
            onSubmit={handleEditComment}
            onCancel={() => setEditingComment(null)}
          />
        </Box>
      ) : null}
      <CommentList
        comments={comments}
        currentUserId={user?.id}
        postOwnerId={post.user_id}
        onEdit={setEditingComment}
        onDelete={setDeletingComment}
      />
      {user && !editingComment && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Add a comment
          </Typography>
          <CommentForm onSubmit={handleAddComment} />
        </Box>
      )}

      <Dialog open={Boolean(deletingComment)} onClose={() => setDeletingComment(null)}>
        <DialogTitle>Delete comment?</DialogTitle>
        <DialogContent>
          <DialogContentText>This cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingComment(null)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => deletingComment && handleDeleteComment(deletingComment)}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deletingPost} onClose={() => setDeletingPost(false)}>
        <DialogTitle>Delete post?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete the post and its comments. This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingPost(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeletePost}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
