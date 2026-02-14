'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { getPost, updatePost } from '@/lib/api';
import type { Post } from '@/lib/types';
import { PostForm } from '@/components/PostForm';
import { useAuth } from '@/contexts/AuthContext';

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;
  const { user, loading: authLoading } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    getPost(id).then((res) => {
      if (res.error) {
        setError(res.error.message ?? 'Post not found');
        setPost(null);
      } else if (res.data) {
        setPost(res.data);
        setError(null);
      }
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (post && user.id !== post.user_id) {
      router.replace(`/blog/${id}`);
    }
  }, [user, authLoading, post, id, router]);

  const handleSubmit = async (data: { title: string; body: string }) => {
    if (!id) return;
    const res = await updatePost(id, data);
    if (res.error) {
      const err = res.error as { message?: string; errors?: Record<string, string[]> };
      const msg = err.errors?.title?.[0] ?? err.errors?.body?.[0] ?? err.message ?? 'Failed to update post';
      throw new Error(msg);
    }
    router.push(`/blog/${id}`);
  };

  if (authLoading || loading) {
    return (
      <Typography color="text.secondary">Loading…</Typography>
    );
  }

  if (!user) {
    return null;
  }

  if (error || !post) {
    return (
      <Typography color="error">{error ?? 'Post not found.'}</Typography>
    );
  }

  if (user.id !== post.user_id) {
    return null;
  }

  return (
    <>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Edit post
      </Typography>
      <PostForm
        initialTitle={post.title}
        initialBody={post.body}
        submitLabel="Save changes"
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/blog/${id}`)}
      />
    </>
  );
}
