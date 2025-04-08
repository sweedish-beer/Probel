// src/components/Flowchart/FlowchartsList.tsx
import React from 'react';
import { List, ListItemButton, ListItemText, Typography, Box } from '@mui/material';
import { Flowchart } from '../../types';

interface FlowchartsListProps {
  flowcharts: Flowchart[];
  selectedFlowchartId?: string;
  onSelectFlowchart: (flowchart: Flowchart) => void;
}

const FlowchartsList: React.FC<FlowchartsListProps> = ({ 
  flowcharts, 
  selectedFlowchartId, 
  onSelectFlowchart 
}) => {
  if (flowcharts.length === 0) {
    return (
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography color="text.secondary" variant="body2">
          No flowcharts yet
        </Typography>
      </Box>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <List sx={{ width: '100%', p: 0 }}>
      {flowcharts.map((flowchart) => (
        <ListItemButton
          key={flowchart.id}
          selected={flowchart.id === selectedFlowchartId}
          onClick={() => onSelectFlowchart(flowchart)}
          sx={{ 
            borderRadius: 1,
            mb: 0.5,
            '&.Mui-selected': {
              backgroundColor: 'action.selected',
            }
          }}
        >
          <ListItemText
            primary={flowchart.title || 'Untitled'}
            secondary={formatDate(flowchart.last_updated)}
            primaryTypographyProps={{
              noWrap: true,
              fontWeight: flowchart.id === selectedFlowchartId ? 500 : 400,
            }}
            secondaryTypographyProps={{
              noWrap: true,
              fontSize: '0.75rem',
            }}
          />
        </ListItemButton>
      ))}
    </List>
  );
};

export default FlowchartsList;