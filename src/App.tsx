// src/App.tsx
import './App.css';
import MainLayout from './components/Layout/MainLayout';
import { Typography, ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <MainLayout>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to Probel
          </Typography>
          <Typography paragraph>
            Your productivity workspace - notes, flowcharts, and AI assistance.
          </Typography>
        </MainLayout>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;