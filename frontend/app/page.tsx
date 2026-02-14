'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function Home() {
  return (
    <Box
      className="min-h-[70vh] flex flex-col items-center justify-center text-center"
      sx={{
        background: 'linear-gradient(180deg, var(--background) 0%, rgba(25, 118, 210, 0.06) 100%)',
      }}
    >
      <Typography
        component="h1"
        variant="h3"
        fontWeight={700}
        gutterBottom
        className="max-w-2xl"
      >
        Welcome to the blog
      </Typography>
      <Typography
        variant="h6"
        color="text.secondary"
        className="max-w-xl mb-6"
      >
        Stories, ideas, and updates. Read the latest posts or sign in to write your own.
      </Typography>
      <Button
        component={Link}
        href="/blog"
        variant="contained"
        size="large"
        sx={{ px: 4, py: 1.5, textTransform: 'none', fontSize: '1.1rem' }}
      >
        Read the blog
      </Button>
    </Box>
  );
}
