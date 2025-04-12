// src/components/AIChat/AIChatPanel.tsx
import React from 'react';
import { Box } from '@mui/material';
import AIChatPage from './AIChatPage';

interface AIChatPanelProps {
  initialChatId?: string;
}
//@ts-ignore-unused
const AIChatPanel: React.FC<AIChatPanelProps> = ({ initialChatId }) => {
  return (
    <Box sx={{ 
      height: '100%', 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <AIChatPage />
    </Box>
  );
};

export default AIChatPanel;