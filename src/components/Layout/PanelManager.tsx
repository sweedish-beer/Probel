// src/components/Layout/PanelManager.tsx
import React, { useState, ReactNode } from 'react';
import { Box, Button, Tooltip, SpeedDial, SpeedDialIcon, SpeedDialAction } from '@mui/material';
import NoteIcon from '@mui/icons-material/Note';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ChatIcon from '@mui/icons-material/Chat';
import FloatingPanel from './FloatingPanel';
import NotePanel from '../Notes/NotePanel';
import FlowchartPanel from '../Flowchart/FlowchartPanel';
import AIChatPanel from '../AI/AIChatPanel'

// Panel type definition
export interface Panel {
    id: string;
    type: 'notes' | 'flowcharts' | 'ai-chat';
    title: string;
    initialPosition?: { x: number; y: number };
    initialSize?: { width: number; height: number };
    content: ReactNode;
}

const PanelManager: React.FC = () => {
    const [panels, setPanels] = useState<Panel[]>([]);
    const [activePanel, setActivePanel] = useState<string | null>(null);
    const [speedDialOpen, setSpeedDialOpen] = useState(false);

    // Add a new panel
    const addPanel = (panel: Panel) => {
        // If the panel already exists, just make it active
        if (panels.some(p => p.id === panel.id)) {
            setActivePanel(panel.id);
            return;
        }

        // Calculate a cascading position for new panels
        const offset = panels.length * 30;
        const position = panel.initialPosition || {
            x: 100 + offset,
            y: 100 + offset
        };

        const newPanel = {
            ...panel,
            initialPosition: position,
        };

        setPanels([...panels, newPanel]);
        setActivePanel(newPanel.id);
    };

    // Remove a panel
    const removePanel = (panelId: string) => {
        setPanels(panels.filter(panel => panel.id !== panelId));
        if (activePanel === panelId) {
            setActivePanel(panels.length > 1 ? panels[panels.length - 2].id : null);
        }
    };

    // Bring a panel to the front
    const bringToFront = (panelId: string) => {
        setActivePanel(panelId);
    };


    // Create a new notes panel
    const createNotesPanel = () => {
        const notesPanel: Panel = {
            id: `notes-${Date.now()}`,
            type: 'notes',
            title: 'Notes',
            content: <NotePanel />,
        };
        addPanel(notesPanel);
        setSpeedDialOpen(false);
    };

    // Create a new flowcharts panel
    const createFlowchartsPanel = () => {
        const flowchartsPanel: Panel = {
            id: `flowcharts-${Date.now()}`,
            type: 'flowcharts',
            title: 'Flowcharts',
            content: <FlowchartPanel />,
        };
        addPanel(flowchartsPanel);
        setSpeedDialOpen(false);
    };

    // Create a new AI chat panel
    const createAIChatPanel = () => {
        const aiChatPanel: Panel = {
            id: `ai-chat-${Date.now()}`,
            type: 'ai-chat',
            title: 'AI Chat',
            content: <AIChatPanel />,
        };
        addPanel(aiChatPanel);
        setSpeedDialOpen(false);
    };

    // Speed dial actions for adding different panel types
    const actions = [
        { icon: <NoteIcon />, name: 'New Notes', action: createNotesPanel },
        { icon: <AccountTreeIcon />, name: 'New Flowchart', action: createFlowchartsPanel },
        { icon: <ChatIcon />, name: 'New AI Chat', action: createAIChatPanel },
    ];

    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            bgcolor: 'background.default',
            display: 'flex',
            flexDirection: 'column',
            p: 2
        }}>
            {/* Render all panels */}
            {panels.map((panel, index) => (
                <FloatingPanel
                    key={panel.id}
                    title={panel.title}
                    initialPosition={panel.initialPosition}
                    initialSize={panel.initialSize}
                    onClose={() => removePanel(panel.id)}
                    zIndex={activePanel === panel.id ? 1000 : 900 - index}
                    bringToFront={() => bringToFront(panel.id)}
                    activePanel={activePanel === panel.id}
                >
                    {panel.content}
                </FloatingPanel>
            ))}
            {/* Speed dial for adding new panels */}
            <SpeedDial
                ariaLabel="Add panel"
                sx={{ position: 'absolute', bottom: 16, right: 16 }}
                icon={<SpeedDialIcon />}
                onClose={() => setSpeedDialOpen(false)}
                onOpen={() => setSpeedDialOpen(true)}
                open={speedDialOpen}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        onClick={action.action}
                    />
                ))}
            </SpeedDial>

            {/* Quick buttons for adding panels (alternative to speed dial) */}
            <Box sx={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                display: 'flex',
                gap: 1
            }}>
                <Tooltip title="New Notes">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={createNotesPanel}
                        startIcon={<NoteIcon />}
                    >
                        Notes
                    </Button>
                </Tooltip>
                <Tooltip title="New Flowchart">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={createFlowchartsPanel}
                        startIcon={<AccountTreeIcon />}
                    >
                        Flowchart
                    </Button>
                </Tooltip>
                <Tooltip title="New AI Chat">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={createAIChatPanel}
                        startIcon={<ChatIcon />}
                    >
                        AI Chat
                    </Button>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default PanelManager;