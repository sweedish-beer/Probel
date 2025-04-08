// src/components/Notes/NotesList.tsx
import React from 'react';
import { List, ListItemButton, ListItemText, Typography, Box } from '@mui/material';
import { Note } from '../../types';

interface NotesListProps {
  notes: Note[];
  selectedNoteId?: string;
  onSelectNote: (note: Note) => void;
}

const NotesList: React.FC<NotesListProps> = ({ notes, selectedNoteId, onSelectNote }) => {
  if (notes.length === 0) {
    return (
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography color="text.secondary" variant="body2">
          No notes yet
        </Typography>
      </Box>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <List sx={{ width: '100%', p: 0 }}>
      {notes.map((note) => (
        <ListItemButton
          key={note.id}
          selected={note.id === selectedNoteId}
          onClick={() => onSelectNote(note)}
          sx={{ 
            borderRadius: 1,
            mb: 0.5,
            '&.Mui-selected': {
              backgroundColor: 'action.selected',
            }
          }}
        >
          <ListItemText
            primary={note.title || 'Untitled'}
            secondary={formatDate(note.last_updated)}
            primaryTypographyProps={{
              noWrap: true,
              fontWeight: note.id === selectedNoteId ? 500 : 400,
            }}
            secondaryTypographyProps={{
              noWrap: true,
              fontSize: '0.75rem',
            }}
          />
        </ListItemButton>
      ))}
    </List>
  );
};

export default NotesList;