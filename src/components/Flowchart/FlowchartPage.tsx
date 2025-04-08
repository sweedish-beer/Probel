// src/components/Flowchart/FlowchartPage.tsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import FlowchartsList from './FlowchartsList';
import FlowchartEditor from './FlowchartEditor';
import { Flowchart, NewFlowchart } from '../../types';
import { flowchartService } from '../../services/flowchartService';


const FlowchartPage: React.FC = () => {
    const [flowcharts, setFlowcharts] = useState<Flowchart[]>([]);
    const [selectedFlowchart, setSelectedFlowchart] = useState<Flowchart | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadFlowcharts();
    }, []);

    const loadFlowcharts = async () => {
        try {
            setLoading(true);
            const fetchedFlowcharts = await flowchartService.getFlowcharts();
            setFlowcharts(fetchedFlowcharts);
            setError(null);
        } catch (err) {
            setError('Failed to load flowcharts');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateFlowchart = async (flowchartData: Partial<Flowchart>) => {
        try {
            // Cast to NewFlowchart since we're ensuring all required fields are present
            const newFlowchart = await flowchartService.createFlowchart(flowchartData as NewFlowchart);
            setFlowcharts([newFlowchart, ...flowcharts]);
            setIsCreating(false);
            setSelectedFlowchart(newFlowchart);
        } catch (err) {
            setError('Failed to create flowchart');
            console.error(err);
        }
    };

    const handleUpdateFlowchart = async (id: string, updates: Partial<Flowchart>) => {
        try {
            const updatedFlowchart = await flowchartService.updateFlowchart(id, updates);
            setFlowcharts(flowcharts.map(flow => flow.id === id ? updatedFlowchart : flow));
            setSelectedFlowchart(updatedFlowchart);
        } catch (err) {
            setError('Failed to update flowchart');
            console.error(err);
        }
    };

    const handleDeleteFlowchart = async (id: string) => {
        try {
            await flowchartService.deleteFlowchart(id);
            setFlowcharts(flowcharts.filter(flow => flow.id !== id));
            setSelectedFlowchart(null);
        } catch (err) {
            setError('Failed to delete flowchart');
            console.error(err);
        }
    };

    const handleSelectFlowchart = (flowchart: Flowchart) => {
        setSelectedFlowchart(flowchart);
        setIsCreating(false);
    };

    const handleNewFlowchart = () => {
        setIsCreating(true);
        setSelectedFlowchart(null);
    };

    return (
        <Box sx={{ display: 'flex', height: '100%' }}>
            {/* Flowcharts List */}
            <Box sx={{ width: 300, borderRight: 1, borderColor: 'divider', p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">Flowcharts</Typography>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={handleNewFlowchart}
                    >
                        New
                    </Button>
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <FlowchartsList
                        flowcharts={flowcharts}
                        selectedFlowchartId={selectedFlowchart?.id}
                        onSelectFlowchart={handleSelectFlowchart}
                    />
                )}
            </Box>

            {/* Flowchart Editor */}
            <Box sx={{ flex: 1, p: 2, height: '100%' }}>
                {isCreating ? (
                    <FlowchartEditor
                        onSave={handleCreateFlowchart}
                        onCancel={() => setIsCreating(false)}
                    />
                ) : selectedFlowchart ? (
                    <FlowchartEditor
                        flowchart={selectedFlowchart}
                        onSave={(updates) => handleUpdateFlowchart(selectedFlowchart.id, updates)}
                        onDelete={() => handleDeleteFlowchart(selectedFlowchart.id)}
                        onCancel={() => setSelectedFlowchart(null)}
                    />
                ) : (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        backgroundColor: 'background.paper',
                        borderRadius: 2
                    }}>
                        <Typography color="text.secondary">
                            Select a flowchart or create a new one
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default FlowchartPage;