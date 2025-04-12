// src/components/Layout/Sidebar.tsx
import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import NoteIcon from '@mui/icons-material/Note';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ChatIcon from '@mui/icons-material/Chat';

interface SidebarProps {
  onNavigate: (page: string) => void;
  activePage: string;
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, activePage, collapsed }) => {
  return (
    <Box sx={{ overflow: 'auto' }}>
      <List>
        <ListItem disablePadding>
          <ListItemButton
            selected={activePage === 'notes'}
            onClick={() => onNavigate('notes')}
          >
            <ListItemIcon>
              <NoteIcon />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Notes" />}
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
            {!collapsed && <ListItemText primary="Flowcharts" />}
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
            {!collapsed && <ListItemText primary="AI Chat" />}
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;