// src/components/Layout/Sidebar.tsx
import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
// We'll need to install Material Icons
import NoteIcon from '@mui/icons-material/Note';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ChatIcon from '@mui/icons-material/Chat';

interface SidebarProps {
  onNavigate: (page: string) => void;
  activePage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, activePage }) => {
  return (
    <Box
      component="nav"
      sx={{
        width: 240,
        flexShrink: 0,
        borderRight: 1,
        borderColor: 'divider',
      }}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton 
            selected={activePage === 'notes'}
            onClick={() => onNavigate('notes')}
          >
            <ListItemIcon>
              <NoteIcon />
            </ListItemIcon>
            <ListItemText primary="Notes" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton 
            selected={activePage === 'flowcharts'}
            onClick={() => onNavigate('flowcharts')}
          >
            <ListItemIcon>
              <AccountTreeIcon />
            </ListItemIcon>
            <ListItemText primary="Flowcharts" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton 
            selected={activePage === 'ai-chat'}
            onClick={() => onNavigate('ai-chat')}
          >
            <ListItemIcon>
              <ChatIcon />
            </ListItemIcon>
            <ListItemText primary="AI Chat" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;