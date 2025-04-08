// src/services/flowchartService.ts
import { supabase } from './supabase';
import { Flowchart, NewFlowchart } from '../types';

export const flowchartService = {
  async getFlowcharts() {
    const { data, error } = await supabase
      .from('flowcharts')
      .select('*')
      .order('last_updated', { ascending: false });
    
    if (error) {
      console.error('Error fetching flowcharts:', error);
      throw error;
    }
    
    return data as Flowchart[];
  },
  
  async createFlowchart(flowchart: NewFlowchart) {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const flowchartWithUser = {
      ...flowchart,
      user_id: user.id
    };
    
    const { data, error } = await supabase
      .from('flowcharts')
      .insert([flowchartWithUser])
      .select();
    
    if (error) {
      console.error('Error creating flowchart:', error);
      throw error;
    }
    
    return data[0] as Flowchart;
  },
  
  async updateFlowchart(id: string, updates: Partial<Flowchart>) {
    const { data, error } = await supabase
      .from('flowcharts')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error updating flowchart:', error);
      throw error;
    }
    
    return data[0] as Flowchart;
  },
  
  async deleteFlowchart(id: string) {
    const { error } = await supabase
      .from('flowcharts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting flowchart:', error);
      throw error;
    }
    
    return true;
  },
  
  async getFlowchartById(id: string) {
    const { data, error } = await supabase
      .from('flowcharts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching flowchart:', error);
      throw error;
    }
    
    return data as Flowchart;
  }
};