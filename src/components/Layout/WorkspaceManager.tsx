// src/components/Layout/WorkspaceManager.tsx
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Box, Tabs, Tab, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ToolGrid from './ToolGrid';

// Define the ref handle interface
export interface WorkspaceManagerHandle {
  addTool: (type: 'notes' | 'flowchart' | 'ai-chat', addToSide: boolean) => void;
}

interface Workspace {
  id: string;
  name: string;
  tools: Tool[];
}

export interface Tool {
  id: string;
  type: 'notes' | 'flowchart' | 'ai-chat';
  position: {
    x: number;
    y: number;
  };
}

//@ts-expect-error
const WorkspaceManager = forwardRef<WorkspaceManagerHandle>((props, ref) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    { id: 'default', name: 'Workspace 1', tools: [] }
  ]);
  const [activeWorkspace, setActiveWorkspace] = useState(0);

  const handleAddWorkspace = () => {
    setWorkspaces([
      ...workspaces,
      {
        id: `workspace-${Date.now()}`,
        name: `Workspace ${workspaces.length + 1}`,
        tools: []
      }
    ]);
    setActiveWorkspace(workspaces.length);
  };

  const handleCloseWorkspace = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (workspaces.length <= 1) return; // Don't remove last workspace
    
    const newWorkspaces = [...workspaces];
    newWorkspaces.splice(index, 1);
    setWorkspaces(newWorkspaces);
    
    if (activeWorkspace >= index && activeWorkspace > 0) {
      setActiveWorkspace(activeWorkspace - 1);
    }
  };

  // Add tool to the current workspace
  const addTool = (type: 'notes' | 'flowchart' | 'ai-chat', addToSide: boolean) => {
    const currentWorkspace = workspaces[activeWorkspace];
    const newTool: Tool = {
      id: `${type}-${Date.now()}`,
      type,
      position: {
        x: addToSide && currentWorkspace.tools.length > 0 ? 1 : 0,
        y: 0,
      }
    };
    
    const updatedTools = addToSide
      ? [...currentWorkspace.tools, newTool]
      : [newTool]; // Replace all tools if not adding to side
    
    const updatedWorkspace = {
      ...currentWorkspace,
      tools: updatedTools
    };
    
    const newWorkspaces = [...workspaces];
    newWorkspaces[activeWorkspace] = updatedWorkspace;
    setWorkspaces(newWorkspaces);
  };

  // Expose methods to the parent component via ref
  useImperativeHandle(ref, () => ({
    addTool
  }));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeWorkspace}
          onChange={(_, newValue) => setActiveWorkspace(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {workspaces.map((workspace, index) => (
            <Tab
              key={workspace.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {workspace.name}
                  {workspaces.length > 1 && (
                    <IconButton
                      size="small"
                      onClick={(e) => handleCloseWorkspace(index, e)}
                      sx={{ ml: 1 }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              }
            />
          ))}
          <IconButton onClick={handleAddWorkspace} sx={{ minWidth: 'auto' }}>
            <AddIcon />
          </IconButton>
        </Tabs>
      </Box>
      
      {/* Pass current workspace tools to ToolGrid */}
      <ToolGrid 
        tools={workspaces[activeWorkspace].tools} 
        addTool={addTool}
      />
    </Box>
  );
});

export default WorkspaceManager;