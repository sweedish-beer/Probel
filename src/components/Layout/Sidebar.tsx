// src/components/Layout/Sidebar.tsx
import React, { useState } from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Switch,
  Typography,
  Divider,
  IconButton
} from '@mui/material';
import NoteIcon from '@mui/icons-material/Note';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ChatIcon from '@mui/icons-material/Chat';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onSelectTool: (toolType: 'notes' | 'flowchart' | 'ai-chat', addToSide: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  collapsed, 
  onToggleCollapse,
  onSelectTool 
}) => {
  const [addMode, setAddMode] = useState(false);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      width: collapsed ? 64 : 240,
      transition: 'width 0.3s',
    }}>
      <Box sx={{ 
        p: 2, 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: 1,
        borderColor: 'divider'
      }}>
        {!collapsed && <Typography variant="subtitle1">Tools</Typography>}
        <IconButton onClick={onToggleCollapse}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>

      {/* Add Mode Toggle */}
      {!collapsed && (
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 1 }}>Add Mode</Typography>
          <Switch 
            size="small"
            checked={addMode}
            onChange={(e) => setAddMode(e.target.checked)}
          />
        </Box>
      )}
      
      <Divider />
      
      <List sx={{ width: '100%' }}>
        <ListItem disablePadding>
          <ListItemButton 
            onClick={() => onSelectTool('notes', addMode)}
          >
            <ListItemIcon>
              <NoteIcon />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Notes" />}
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton 
            onClick={() => onSelectTool('flowchart', addMode)}
          >
            <ListItemIcon>
              <AccountTreeIcon />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Flowcharts" />}
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton 
            onClick={() => onSelectTool('ai-chat', addMode)}
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