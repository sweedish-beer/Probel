// src/components/Notes/NoteEditor.tsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Divider
} from '@mui/material';
import { Note, NewNote } from '../../types';

interface NoteEditorProps {
    note?: Note;
    onSave: (note: Partial<Note> | NewNote) => void;
    onCancel: () => void;
    onDelete?: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave, onCancel, onDelete }) => {
    const [title, setTitle] = useState(note?.title || '');
    const [content, setContent] = useState(note?.content || '');
    const [isEditing, setIsEditing] = useState(!note); // Start in edit mode if creating new note

    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setContent(note.content);
        } else {
            setTitle('');
            setContent('');
        }
        setIsEditing(!note);
    }, [note]);

    const handleSave = () => {
        const updatedNote = {
            title: title.trim() || 'Untitled',
            content,
        };
        onSave(updatedNote);
        setIsEditing(false);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString();
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
                {isEditing ? (
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                ) : (
                    <Typography variant="h5" gutterBottom>
                        {title || 'Untitled'}
                    </Typography>
                )}

                {note && !isEditing && (
                    <Typography variant="caption" color="text.secondary">
                        Last updated: {formatDate(note.last_updated)}
                    </Typography>
                )}
            </Box>

            <Box sx={{
                flex: 1,
                p: 2,
                overflow: 'auto',
                backgroundColor: 'background.default'
            }}>
                {isEditing ? (
                    <TextField
                        fullWidth
                        multiline
                        variant="outlined"
                        label="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        minRows={10}
                        maxRows={20}
                        sx={{ height: '100%' }}
                    />
                ) : (
                    <Typography
                        sx={{
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word'
                        }}
                    >
                        {content}
                    </Typography>
                )}
            </Box>

            <Divider />
            <Box sx={{
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                backgroundColor: 'background.paper'
            }}>
                <Box>
                    {note && onDelete && (
                        <Button
                            color="error"
                            onClick={onDelete}
                        >
                            Delete
                        </Button>
                    )}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button onClick={onCancel}>
                        Cancel
                    </Button>
                    {isEditing ? (
                        <Button
                            variant="contained"
                            onClick={handleSave}
                            disabled={!content.trim() && !title.trim()}
                        >
                            Save
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit
                        </Button>
                    )}
                </Box>
            </Box>
        </Paper>
    );
};

export default NoteEditor;