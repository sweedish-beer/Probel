// src/components/Layout/MainLayout.tsx
import { useState } from 'react';
import { Box, Drawer, AppBar, Toolbar, IconButton, Typography, CircularProgress } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useAuth } from '../../contexts/AuthContext';
import AuthPage from '../../pages/AuthPage';
import NotePage from '../Notes/NotePage';
import FlowchartPage from '../Flowchart/FlowchartPage';
import AIChatPage from '../AI/AIChatPage';
import Sidebar from './Sidebar';

const MainLayout = () => {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(true);
  const [activePage, setActivePage] = useState('notes');

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>;
  }

  if (!user) {
    return <AuthPage />;
  }

  const renderContent = () => {
    switch (activePage) {
      case 'notes':
        return <NotePage />;
      case 'flowcharts':
        return <FlowchartPage />;
      case 'ai-chat':
        return <AIChatPage />;
      default:
        return <NotePage />;
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={() => setOpen(!open)}
            edge="start"
            sx={{ mr: 2 }}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            pro bel
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="permanent"
        sx={{
          width: open ? 240 : 64,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? 240 : 64,
            boxSizing: 'border-box',
            transition: 'width 0.2s'
          },
        }}
        open={open}
      >
        <Toolbar /> {/* Spacer to push content below AppBar */}
        <Sidebar 
          onNavigate={setActivePage} 
          activePage={activePage} 
          collapsed={!open} 
        />
      </Drawer>
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'hidden' }}>
        <Toolbar /> {/* Spacer to push content below AppBar */}
        {renderContent()}
      </Box>
    </Box>
  );
};

export default MainLayout;