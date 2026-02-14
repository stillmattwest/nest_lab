'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import { getPosts } from '@/lib/api';
import type { Post } from '@/lib/types';
import { PostCard } from '@/components/PostCard';
import { useAuth } from '@/contexts/AuthContext';

export default function BlogPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [meta, setMeta] = useState<{ current_page: number; last_page: number } | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const lastPage = meta?.last_page ?? 1;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getPosts({ page })
      .then((res) => {
        if (cancelled) return;
        if (res.error) {
          setError(res.error.message ?? 'Failed to load posts');
          setPosts([]);
          setMeta(null);
        } else if (res.data) {
          setPosts(res.data.data);
          setMeta(res.data.meta);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  if (loading && posts.length === 0) {
    return (
      <Box className="py-8">
        <Typography color="text.secondary">Loading posts…</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="py-8">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <Typography variant="h4" fontWeight={600}>
          Blog
        </Typography>
        {user && (
          <Button
            component={Link}
            href="/blog/new"
            variant="contained"
          >
            New post
          </Button>
        )}
      </Box>
      {posts.length === 0 ? (
        <Typography color="text.secondary">No posts yet.</Typography>
      ) : (
        <>
          <Box
            component="ul"
            className="grid gap-6 list-none p-0 m-0"
            sx={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            }}
          >
            {posts.map((post) => (
              <Box component="li" key={post.id}>
                <PostCard post={post} />
              </Box>
            ))}
          </Box>
          {lastPage > 1 && (
            <Box className="flex justify-center mt-8">
              <Pagination
                count={lastPage}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
