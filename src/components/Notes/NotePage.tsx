// src/components/Notes/NotePage.tsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import NotesList from './NotesList';
import NoteEditor from './NoteEditor';
import { Note, NewNote } from '../../types';
import { notesService } from '../../services/notesService';

const NotePage: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = async () => {
        try {
            setLoading(true);
            const fetchedNotes = await notesService.getNotes();
            setNotes(fetchedNotes);
            setError(null);
        } catch (err) {
            setError('Failed to load notes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNote = async (noteData: NewNote | Partial<Note>) => {
        try {
            // Make sure we're treating it as a NewNote
            const newNote = await notesService.createNote(noteData as NewNote);
            setNotes([newNote, ...notes]);
            setIsCreating(false);
            setSelectedNote(newNote);
        } catch (err) {
            setError('Failed to create note');
            console.error(err);
        }
    };


    const handleUpdateNote = async (id: string, updates: Partial<Note>) => {
        try {
            const updatedNote = await notesService.updateNote(id, updates);
            setNotes(notes.map(note => note.id === id ? updatedNote : note));
            setSelectedNote(updatedNote);
        } catch (err) {
            setError('Failed to update note');
            console.error(err);
        }
    };

    const handleDeleteNote = async (id: string) => {
        try {
            await notesService.deleteNote(id);
            setNotes(notes.filter(note => note.id !== id));
            setSelectedNote(null);
        } catch (err) {
            setError('Failed to delete note');
            console.error(err);
        }
    };

    const handleSelectNote = (note: Note) => {
        setSelectedNote(note);
        setIsCreating(false);
    };

    const handleNewNote = () => {
        setIsCreating(true);
        setSelectedNote(null);
    };

    return (
        <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
            {/* Notes List */}
            <Box sx={{ width: 250, borderRight: 1, borderColor: 'divider', p: 2, overflow: 'auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle1">Notes</Typography>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={handleNewNote}
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
                    <NotesList
                        notes={notes}
                        selectedNoteId={selectedNote?.id}
                        onSelectNote={handleSelectNote}
                    />
                )}
            </Box>

            {/* Note Editor */}
            <Box sx={{ flex: 1, p: 2 }}>
                {isCreating ? (
                    <NoteEditor
                        onSave={handleCreateNote}
                        onCancel={() => setIsCreating(false)}
                    />
                ) : selectedNote ? (
                    <NoteEditor
                        note={selectedNote}
                        onSave={(updates) => handleUpdateNote(selectedNote.id, updates)}
                        onDelete={() => handleDeleteNote(selectedNote.id)}
                        onCancel={() => setSelectedNote(null)}
                    />
                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Typography color="text.secondary">
                            Select a note or create a new one
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default NotePage;