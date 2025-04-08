// src/components/Layout/MainLayout.tsx
import React, { ReactNode, useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import AuthPage from '../../pages/AuthPage';
import NotePage from '../Notes/NotePage';
import FlowchartPage from '../Flowchart/FlowchartPage';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState('notes');

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

  const renderContent = () => {
    switch (activePage) {
      case 'notes':
        return <NotePage />;
      case 'flowcharts':
        return <FlowchartPage />;
      case 'ai-chat':
        return <div>AI Chat (Coming Soon)</div>;
      default:
        return children;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar onNavigate={setActivePage} activePage={activePage} />
        <Box component="main" sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;