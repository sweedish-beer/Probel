// src/components/Flowchart/FlowchartEditor.tsx

import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node,
    NodeTypes,
    EdgeTypes,
    Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Box, TextField, Button, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import { Flowchart } from '../../types';

interface FlowchartEditorProps {
    flowchart?: Flowchart;
    onSave: (flowchart: Partial<Flowchart>) => void | Promise<void>;
    onDelete?: () => void;
    onCancel: () => void;
}

// Initial nodes for a new flowchart
const initialNodes: Node[] = [
    {
        id: '1',
        type: 'input',
        data: { label: 'Start' },
        position: { x: 250, y: 25 },
    }
];

const FlowchartEditor: React.FC<FlowchartEditorProps> = ({
    flowchart,
    onSave,
    onDelete,
    onCancel
}) => {
    const [title, setTitle] = useState(flowchart?.title || '');
    const [description, setDescription] = useState(flowchart?.description || '');
    const [nodes, setNodes, onNodesChange] = useNodesState(flowchart?.nodes || initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(flowchart?.edges || []);
    const [isEditingTitle, setIsEditingTitle] = useState(!flowchart);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

    // Handle node label editing
    const onNodeDoubleClick = (event: React.MouseEvent, node: Node) => {
        const nodeCopy = { ...node };
        const newLabel = prompt('Enter new label', node.data.label as string);
        if (newLabel !== null) {
            nodeCopy.data = { ...nodeCopy.data, label: newLabel };
            setNodes((nds) => nds.map((n) => (n.id === node.id ? nodeCopy : n)));
        }
    };

    // Handle edge connections
    const onConnect = useCallback(
        (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    // Add a new node
    const onAddNode = useCallback(() => {
        const newNode: Node = {
            id: (nodes.length + 1).toString(),
            data: { label: `Node ${nodes.length + 1}` },
            position: {
                x: Math.random() * 500,
                y: Math.random() * 500,
            },
        };
        setNodes((nds) => [...nds, newNode]);
    }, [nodes, setNodes]);

    // Save the flowchart
    const handleSave = () => {
        const updatedFlowchart = {
            title: title.trim() || 'Untitled',
            description,
            nodes,
            edges,
        };
        onSave(updatedFlowchart);
        setIsEditingTitle(false);
    };

    // Handle delete confirmation
    const handleDeleteConfirm = () => {
        setIsDialogOpen(false);
        if (onDelete) onDelete();
    };

    return (
        <Paper sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            overflow: 'hidden'
        }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                {isEditingTitle ? (
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">{title || 'Untitled'}</Typography>
                        <Button onClick={() => setIsEditingTitle(true)}>Edit Title</Button>
                    </Box>
                )}

                {isEditingTitle && (
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        multiline
                        rows={2}
                    />
                )}
            </Box>

            <Box sx={{ flex: 1, position: 'relative' }} ref={reactFlowWrapper}>
                <ReactFlowProvider>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        onNodeDoubleClick={onNodeDoubleClick}
                        fitView
                    >
                        <Background />
                        <Controls />
                        <Panel position="top-right">
                            <Button
                                variant="contained"
                                size="small"
                                onClick={onAddNode}
                            >
                                Add Node
                            </Button>
                        </Panel>
                    </ReactFlow>
                </ReactFlowProvider>
            </Box>

            <Box sx={{
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                backgroundColor: 'background.paper',
                borderTop: 1,
                borderColor: 'divider'
            }}>
                <Box>
                    {flowchart && onDelete && (
                        <Button
                            color="error"
                            onClick={() => setIsDialogOpen(true)}
                        >
                            Delete
                        </Button>
                    )}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                </Box>
            </Box>

            {/* Confirm Delete Dialog */}
            <Dialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this flowchart?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default FlowchartEditor;