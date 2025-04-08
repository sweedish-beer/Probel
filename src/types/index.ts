export interface Note {
    id: string;
    title: string;
    content: string;
    user_id: string;
    created_at: string;
    last_updated: string;
    is_archived: boolean;
    tags: string[];
}

export type NewNote = Omit<Note, 'id' | 'created_at' | 'user_id' | 'last_updated'>;

// src/types/index.ts


import { Node, Edge } from 'reactflow';

export interface Flowchart {
    id: string;
    title: string;
    description: string;
    user_id: string;
    created_at: string;
    last_updated: string;
    nodes: Node[];
    edges: Edge[];
}

export type NewFlowchart = Omit<Flowchart, 'id' | 'created_at' | 'user_id' | 'last_updated'>;