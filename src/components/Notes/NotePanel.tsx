// src/components/Notes/NotePanel.tsx
import React from 'react';
import { Box } from '@mui/material';
import NotePage from './NotePage';

interface NotePanelProps {
  initialNoteId?: string;
}

// @ts-ignore-unused

const NotePanel: React.FC<NotePanelProps> = ({ initialNoteId }) => {
  return (
    <Box sx={{ 
      height: '100%', 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <NotePage />
    </Box>
  );
};

export default NotePanel;