// src/components/Layout/Header.tsx
import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const Header: React.FC = () => {
  return (
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
        <Box>
          {/* Placeholder for user profile, etc. */}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;