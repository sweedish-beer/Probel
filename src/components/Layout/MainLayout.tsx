// src/components/Layout/MainLayout.tsx
import { useState, useRef } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  CircularProgress,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../../contexts/AuthContext';
import AuthPage from '../../pages/AuthPage';
import Sidebar from './Sidebar';
import WorkspaceManager, { WorkspaceManagerHandle } from './WorkspaceManager';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const { user, loading } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Use a properly typed ref
  const workspaceManagerRef = useRef<WorkspaceManagerHandle>(null);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const handleSelectTool = (toolType: 'notes' | 'flowchart' | 'ai-chat', addToSide: boolean) => {
    if (workspaceManagerRef.current) {
      workspaceManagerRef.current.addTool(toolType, addToSide);
    }

    // On mobile, close sidebar after selection
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            pro bel
          </Typography>

          <IconButton color="inherit">
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{
          width: sidebarOpen ? (collapsed ? 64 : 240) : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: collapsed ? 64 : 240,
            boxSizing: 'border-box',
            transition: 'width 0.3s',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <Toolbar /> {/* Spacer to push content below AppBar */}
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          onSelectTool={handleSelectTool}
        />
      </Drawer>

      <Box component="main" sx={{
        flexGrow: 1,
        p: 3,
        width: { sm: `calc(100% - ${sidebarOpen ? (collapsed ? 64 : 240) : 0}px)` },
        height: '100%',
        overflow: 'hidden'
      }}>
        <Toolbar /> {/* Spacer to push content below AppBar */}
        <WorkspaceManager ref={workspaceManagerRef} />
      </Box>
    </Box>
  );
};

export default MainLayout;