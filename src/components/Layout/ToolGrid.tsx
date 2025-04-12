// src/components/Layout/ToolGrid.tsx
import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { Tool } from './WorkspaceManager';
import NotePage from '../Notes/NotePage';
import FlowchartPage from '../Flowchart/FlowchartPage';
import AIChatPage from '../AI/AIChatPage';

interface ToolGridProps {
  tools: Tool[];
  addTool: (type: 'notes' | 'flowchart' | 'ai-chat', addToSide: boolean) => void;
}

const ToolGrid: React.FC<ToolGridProps> = ({ tools, addTool }) => {
  // If no tools, show empty message with tool selection buttons
  if (tools.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: 3
        }}
      >
        <Typography color="text.secondary">
          Select a tool to get started
        </Typography>
        
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            onClick={() => addTool('notes', false)}
          >
            Notes
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => addTool('flowchart', false)}
          >
            Flowchart
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => addTool('ai-chat', false)}
          >
            AI Chat
          </Button>
        </Stack>
      </Box>
    );
  }

  // Group tools by row (y position)
  const rows: Tool[][] = [];
  tools.forEach(tool => {
    if (!rows[tool.position.y]) {
      rows[tool.position.y] = [];
    }
    rows[tool.position.y].push(tool);
  });

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'auto'
    }}>
      {rows.map((rowTools, rowIndex) => (
        <Box
          key={`row-${rowIndex}`}
          sx={{
            display: 'flex',
            flex: rowIndex === 0 ? 1 : 'none', // First row takes remaining space
            minHeight: rowIndex === 0 ? 0 : 500, // Subsequent rows have min height
            mb: 2
          }}
        >
          {rowTools.map(tool => (
            <Box
              key={tool.id}
              sx={{
                flex: 1,
                height: '100%',
                overflow: 'hidden',
                mr: 2
              }}
            >
              {tool.type === 'notes' && <NotePage />}
              {tool.type === 'flowchart' && <FlowchartPage />}
              {tool.type === 'ai-chat' && <AIChatPage />}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default ToolGrid;