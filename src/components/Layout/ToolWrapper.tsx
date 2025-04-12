// src/components/Layout/ToolWrapper.tsx
import React, { useState } from 'react';
import { 
  Box, 
  IconButton, 
  Typography, 
  Drawer,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

interface ToolWrapperProps {
  title: string;
  sidebarContent: React.ReactNode;
  mainContent: React.ReactNode;
  defaultSidebarOpen?: boolean;
  sidebarWidth?: number;
}

const ToolWrapper: React.FC<ToolWrapperProps> = ({
  title,
  sidebarContent,
  mainContent,
  defaultSidebarOpen = true,
  sidebarWidth = 280
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile && defaultSidebarOpen);

  return (
    <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Tool sidebar drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: sidebarWidth,
            boxSizing: 'border-box',
            position: 'relative',
            height: '100%',
          },
        }}
      >
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider' 
        }}>
          <Typography variant="h6">{title}</Typography>
          <IconButton onClick={() => setSidebarOpen(false)}>
            <ChevronLeftIcon />
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ overflow: 'auto' }}>
          {sidebarContent}
        </Box>
      </Drawer>

      {/* Main content area */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          <IconButton 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">{title}</Typography>
        </Box>

        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {mainContent}
        </Box>
      </Box>
    </Box>
  );
};

export default ToolWrapper;