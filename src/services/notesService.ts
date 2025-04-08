// src/services/notesService.ts
import { supabase } from './supabase';
import { Note, NewNote } from '../types';

export const notesService = {
    async getNotes() {
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .order('last_updated', { ascending: false });

        if (error) {
            console.error('Error fetching notes:', error);
            throw error;
        }

        return data as Note[];
    },

    async createNote(note: NewNote) {
        // Get the current user's ID
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('User not authenticated');
        }

        // Include the user_id to satisfy RLS policy
        const noteWithUser = {
            ...note,
            tags: note.tags || [],
            is_archived: false,
            user_id: user.id
        };

        const { data, error } = await supabase
            .from('notes')
            .insert([noteWithUser])
            .select();

        if (error) {
            console.error('Error creating note:', error);
            throw error;
        }

        return data[0] as Note;
    },

    async updateNote(id: string, updates: Partial<Note>) {
        const { data, error } = await supabase
            .from('notes')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error updating note:', error);
            throw error;
        }

        return data[0] as Note;
    },

    async deleteNote(id: string) {
        const { error } = await supabase
            .from('notes')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting note:', error);
            throw error;
        }

        return true;
    },

    async getNoteById(id: string) {
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching note:', error);
            throw error;
        }

        return data as Note;
    }
};