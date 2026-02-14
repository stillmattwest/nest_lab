'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { user, register: doRegister } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    if (password !== passwordConfirmation) {
      setFieldErrors((prev) => ({
        ...prev,
        password_confirmation: 'Passwords do not match.',
      }));
      return;
    }
    setLoading(true);
    const result = await doRegister({
      name: name.trim(),
      email: email.trim(),
      password,
      password_confirmation: passwordConfirmation,
    });
    setLoading(false);
    if (result.error) {
      setError(result.error);
      if (result.errors) {
        setFieldErrors(
          Object.fromEntries(
            Object.entries(result.errors).map(([k, v]) => [k, v?.[0] ?? ''])
          )
        );
      }
      return;
    }
    router.push('/blog');
  };

  if (user) {
    router.replace('/blog');
    return (
      <Typography color="text.secondary">Redirecting…</Typography>
    );
  }

  return (
    <Box className="max-w-md mx-auto">
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Register
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Already have an account?{' '}
        <Link href="/login" style={{ color: 'inherit' }}>
          Log in
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
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
          error={Boolean(fieldErrors.name)}
          helperText={fieldErrors.name}
          autoComplete="name"
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          error={Boolean(fieldErrors.email)}
          helperText={fieldErrors.email}
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
          error={Boolean(fieldErrors.password)}
          helperText={fieldErrors.password}
          autoComplete="new-password"
        />
        <TextField
          fullWidth
          label="Confirm password"
          type="password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
          disabled={loading}
          error={Boolean(fieldErrors.password_confirmation)}
          helperText={fieldErrors.password_confirmation}
          autoComplete="new-password"
        />
        <Button type="submit" variant="contained" fullWidth disabled={loading}>
          Register
        </Button>
      </Box>
    </Box>
  );
}
