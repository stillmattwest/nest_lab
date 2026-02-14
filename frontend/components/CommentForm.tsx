'use client';

import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

interface CommentFormProps {
  onSubmit: (body: string) => Promise<void>;
  onCancel?: () => void;
  initialBody?: string;
  submitLabel?: string;
}

export function CommentForm({
  onSubmit,
  onCancel,
  initialBody = '',
  submitLabel = 'Submit',
}: CommentFormProps) {
  const [body, setBody] = useState(initialBody);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) {
      setError('Comment cannot be empty.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onSubmit(trimmed);
      setBody('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="space-y-3">
      <TextField
        fullWidth
        multiline
        minRows={2}
        label="Your comment"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        error={Boolean(error)}
        helperText={error}
        disabled={loading}
      />
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
