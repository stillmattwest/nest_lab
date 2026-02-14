'use client';

import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

interface PostFormProps {
  initialTitle?: string;
  initialBody?: string;
  onSubmit: (data: { title: string; body: string }) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export function PostForm({
  initialTitle = '',
  initialBody = '',
  onSubmit,
  onCancel,
  submitLabel = 'Save',
}: PostFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    const b = body.trim();
    setFieldErrors({});
    setError(null);

    if (!t) {
      setFieldErrors((prev) => ({ ...prev, title: 'Title is required.' }));
      return;
    }
    if (!b) {
      setFieldErrors((prev) => ({ ...prev, body: 'Body is required.' }));
      return;
    }
    if (t.length > 255) {
      setFieldErrors((prev) => ({ ...prev, title: 'Title must be at most 255 characters.' }));
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ title: t, body: b });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="space-y-4">
      <TextField
        fullWidth
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={Boolean(fieldErrors.title)}
        helperText={fieldErrors.title}
        disabled={loading}
        inputProps={{ maxLength: 255 }}
      />
      <TextField
        fullWidth
        multiline
        minRows={8}
        label="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        error={Boolean(fieldErrors.body)}
        helperText={fieldErrors.body}
        disabled={loading}
      />
      {error && (
        <Box sx={{ color: 'error.main', typography: 'body2' }}>{error}</Box>
      )}
      <Box className="flex gap-2">
        <Button type="submit" variant="contained" disabled={loading}>
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
      </Box>
    </Box>
  );
}
