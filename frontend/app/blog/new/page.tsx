'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { createPost } from '@/lib/api';
import { PostForm } from '@/components/PostForm';
import { useAuth } from '@/contexts/AuthContext';

export default function NewPostPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (data: { title: string; body: string }) => {
    const res = await createPost(data);
    if (res.error) {
      const err = res.error as { message?: string; errors?: Record<string, string[]> };
      const msg = err.errors?.title?.[0] ?? err.errors?.body?.[0] ?? err.message ?? 'Failed to create post';
      throw new Error(msg);
    }
    if (res.data) {
      router.push(`/blog/${res.data.id}`);
    }
  };

  if (authLoading || !user) {
    return (
      <Typography color="text.secondary">Loading…</Typography>
    );
  }

  return (
    <>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        New post
      </Typography>
      <PostForm submitLabel="Create post" onSubmit={handleSubmit} />
    </>
  );
}
