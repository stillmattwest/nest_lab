'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { useAuth } from '@/contexts/AuthContext';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = searchParams.get('from') ?? '/blog';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push(from);
  };

  if (user) {
    router.replace(from);
    return (
      <Typography color="text.secondary">Redirecting…</Typography>
    );
  }

  return (
    <Box className="max-w-md mx-auto">
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Log in
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Don&apos;t have an account?{' '}
        <Link href="/register" style={{ color: 'inherit' }}>
          Register
        </Link>
      </Typography>
      <Box component="form" onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          autoComplete="email"
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          autoComplete="current-password"
        />
        <Button type="submit" variant="contained" fullWidth disabled={loading}>
          Log in
        </Button>
      </Box>
    </Box>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Typography color="text.secondary">Loading…</Typography>}>
      <LoginForm />
    </Suspense>
  );
}
