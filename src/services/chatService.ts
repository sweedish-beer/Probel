// src/services/chatService.ts
import { supabase } from './supabase';

export interface ChatMessage {
    id?: string;
    chat_id: string;
    content: string;
    sender: 'user' | 'ai';
    content_blocks?: any;
    created_at?: string;
}

export interface Chat {
    id: string;
    title: string;
    user_id: string;
    created_at: string;
    last_updated: string;
}

export const chatService = {
    // Create a new chat
    async createChat(title: string = 'New Chat') {
        // Get the current user's ID
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('User not authenticated');
        }

        const { data, error } = await supabase
            .from('chats')
            .insert([
                {
                    title,
                    user_id: user.id
                }
            ])
            .select();

        if (error) {
            console.error('Error creating chat:', error);
            throw error;
        }

        return data[0] as Chat;
    },

    // Get all chats for the current user
    async getChats() {
        const { data, error } = await supabase
            .from('chats')
            .select('*')
            .order('last_updated', { ascending: false });

        if (error) {
            console.error('Error fetching chats:', error);
            throw error;
        }

        return data as Chat[];
    },

    // Get a specific chat by ID
    async getChatById(chatId: string) {
        const { data, error } = await supabase
            .from('chats')
            .select('*')
            .eq('id', chatId)
            .single();

        if (error) {
            console.error('Error fetching chat:', error);
            throw error;
        }

        return data as Chat;
    },

    // Update chat title
    async updateChat(chatId: string, title: string) {
        const { data, error } = await supabase
            .from('chats')
            .update({ title, last_updated: new Date().toISOString() })
            .eq('id', chatId)
            .select();

        if (error) {
            console.error('Error updating chat:', error);
            throw error;
        }

        return data[0] as Chat;
    },

    // Delete a chat and its messages
    async deleteChat(chatId: string) {
        // First delete all messages in the chat
        const { error: messagesError } = await supabase
            .from('chat_messages')
            .delete()
            .eq('chat_id', chatId);

        if (messagesError) {
            console.error('Error deleting chat messages:', messagesError);
            throw messagesError;
        }

        // Then delete the chat itself
        const { error } = await supabase
            .from('chats')
            .delete()
            .eq('id', chatId);

        if (error) {
            console.error('Error deleting chat:', error);
            throw error;
        }

        return true;
    },

    // Add a message to a chat
    async addMessage(chatId: string, message: Omit<ChatMessage, 'id' | 'chat_id' | 'created_at'>) {
        // Update the chat's last_updated timestamp
        await supabase
            .from('chats')
            .update({ last_updated: new Date().toISOString() })
            .eq('id', chatId);

        const { data, error } = await supabase
            .from('chat_messages')
            .insert([
                {
                    chat_id: chatId,
                    content: message.content,
                    sender: message.sender,
                    content_blocks: message.content_blocks
                }
            ])
            .select();

        if (error) {
            console.error('Error adding message:', error);
            throw error;
        }

        return data[0] as ChatMessage;
    },

    // Get all messages in a chat
    async getChatMessages(chatId: string) {
        const { data, error } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('chat_id', chatId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching chat messages:', error);
            throw error;
        }

        return data as ChatMessage[];
    }
};