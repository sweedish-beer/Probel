// src/App.tsx
import './App.css';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme';
import { AuthProvider } from './contexts/AuthContext';
import MainLayoutWithPanels from './components/Layout/MainLayoutWithPanels';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <MainLayoutWithPanels />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;