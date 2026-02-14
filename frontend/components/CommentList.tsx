'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Comment as CommentType } from '@/lib/types';

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

interface CommentListProps {
  comments: CommentType[];
  currentUserId?: number | null;
  postOwnerId?: number | null;
  onEdit?: (comment: CommentType) => void;
  onDelete?: (comment: CommentType) => void;
}

export function CommentList({
  comments,
  currentUserId,
  postOwnerId,
  onEdit,
  onDelete,
}: CommentListProps) {
  const canEdit = (c: CommentType) => currentUserId === c.user_id;
  const canDelete = (c: CommentType) =>
    currentUserId === c.user_id || currentUserId === postOwnerId;

  if (comments.length === 0) {
    return (
      <Typography color="text.secondary" variant="body2">
        No comments yet.
      </Typography>
    );
  }

  return (
    <Box className="space-y-4">
      {comments.map((comment) => (
        <Card key={comment.id} variant="outlined" sx={{ overflow: 'visible' }}>
          <CardContent>
            <Box className="flex items-start justify-between gap-2">
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {comment.user?.name ?? 'Unknown'} · {formatDate(comment.created_at)}
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {comment.body}
                </Typography>
              </Box>
              {(canEdit(comment) || canDelete(comment)) && (
                <Box className="flex gap-0">
                  {canEdit(comment) && onEdit && (
                    <IconButton
                      size="small"
                      aria-label="Edit comment"
                      onClick={() => onEdit(comment)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                  {canDelete(comment) && onDelete && (
                    <IconButton
                      size="small"
                      aria-label="Delete comment"
                      onClick={() => onDelete(comment)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
