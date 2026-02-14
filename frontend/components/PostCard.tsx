'use client';

import Link from 'next/link';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import type { Post } from '@/lib/types';

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function PostCard({ post }: { post: Post }) {
  const excerpt =
    post.body.length > 160 ? post.body.slice(0, 160).trim() + '…' : post.body;

  return (
    <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="overline" color="text.secondary" component="p">
          {post.user?.name ?? 'Unknown'} · {formatDate(post.created_at)}
        </Typography>
        <Typography component="h2" variant="h5" fontWeight={600} gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {excerpt}
        </Typography>
        <Button
          component={Link}
          href={`/blog/${post.id}`}
          variant="text"
          size="small"
        >
          Read more
        </Button>
      </CardContent>
    </Card>
  );
}
