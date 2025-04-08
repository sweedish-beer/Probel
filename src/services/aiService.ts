// src/services/aiService.ts

// Define types for Anthropic API

interface AnthropicContentBlock {
    type: string;
    text?: string;
    source?: {
      type: string;
      [key: string]: any;
    };
    [key: string]: any; // For other properties based on type
  }
  
  interface AnthropicResponse {
    id: string;
    type: string;
    role: string;
    content: AnthropicContentBlock[];
    model: string;
    stop_reason: string;
    usage: {
      input_tokens: number;
      output_tokens: number;
    };
  }
  
  // Types for our application to use
  export interface AIMessage {
    text: string;
    contentBlocks?: AnthropicContentBlock[];
  }
  
  // Define AI service
  export const aiService = {
    async sendMessage(userMessage: string, previousMessages: { role: string; content: string }[] = []): Promise<AIMessage> {
      try {
        const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
        
        if (!ANTHROPIC_API_KEY) {
          throw new Error('Anthropic API key is missing');
        }
        
        // Construct the messages array with conversation history if provided
        const messages = [
          ...previousMessages,
          {
            role: 'user',
            content: userMessage
          }
        ];
        
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 4096,
            messages: messages,
            temperature: 0.7
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
        }
        
        const data: AnthropicResponse = await response.json();
        
        // Process and sanitize response
        const result: AIMessage = {
          text: '',
          contentBlocks: []
        };
        
        // Extract and process content blocks
        if (data.content && Array.isArray(data.content)) {
          result.contentBlocks = data.content;
          
          // Extract text from content blocks
          const textBlocks = data.content
            .filter(block => block.type === 'text' && typeof block.text === 'string')
            .map(block => block.text as string);
          
          result.text = textBlocks.join('\n');
        } else {
          throw new Error('Unexpected response format from Anthropic API');
        }
        
        return result;
      } catch (error) {
        console.error('Error in AI service:', error);
        throw error;
      }
    }
  };