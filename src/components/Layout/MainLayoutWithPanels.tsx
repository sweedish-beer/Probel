// src/components/Layout/MainLayoutWithPanels.tsx
import React from 'react';
import { Box, CircularProgress, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../../contexts/AuthContext';
import AuthPage from '../../pages/AuthPage';
import PanelManager from './PanelManager';

const MainLayoutWithPanels: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 500,
              letterSpacing: '0.05em',
            }}
          >
            pro bel
          </Typography>
          <IconButton color="inherit">
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <PanelManager />
      </Box>
    </Box>
  );
};

export default MainLayoutWithPanels;