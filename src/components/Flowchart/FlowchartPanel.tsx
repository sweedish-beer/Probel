// src/components/Flowchart/FlowchartPanel.tsx
import React from 'react';
import { Box } from '@mui/material';
import FlowchartPage from './FlowchartPage';

interface FlowchartPanelProps {
  initialFlowchartId?: string;
}
//@ts-ignore-unused
const FlowchartPanel: React.FC<FlowchartPanelProps> = ({ initialFlowchartId }) => {
  return (
    <Box sx={{ 
      height: '100%', 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <FlowchartPage />
    </Box>
  );
};

export default FlowchartPanel;