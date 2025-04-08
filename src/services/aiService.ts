// src/services/aiService.ts

// Define types for Anthropic API responses
interface AnthropicMessage {
    role: string;
    content: string;
}

interface AnthropicResponse {
    id: string;
    type: string;
    role: string;
    content: { type: string; text: string }[];
    model: string;
    stop_reason: string;
    usage: {
        input_tokens: number;
        output_tokens: number;
    };
}

// Define AI service
export const aiService = {
    async sendMessage(userMessage: string) {
        try {
            const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

            if (!ANTHROPIC_API_KEY) {
                throw new Error('Anthropic API key is missing');
            }

            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': ANTHROPIC_API_KEY,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-3-haiku-20240307',
                    max_tokens: 1024,
                    messages: [
                        {
                            role: 'user',
                            content: userMessage
                        }
                    ],
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
            }

            const data: AnthropicResponse = await response.json();

            // Extract text content from response
            if (data.content && data.content.length > 0) {
                return { text: data.content[0].text };
            } else {
                throw new Error('Unexpected response format from Anthropic API');
            }
        } catch (error) {
            console.error('Error in AI service:', error);
            throw error;
        }
    }
};