// src/components/AI/AIChatPage.tsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  Avatar, 
  CircularProgress, 
  Divider,
  IconButton,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { aiService } from '../../services/aiService';

// Interface for chat messages
interface Message {
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIChatPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      content: input.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Get AI response
      const response = await aiService.sendMessage(input);
      
      // Add AI response to chat
      const aiMessage: Message = {
        content: response.text,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Add error message
      const errorMessage: Message = {
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2
      }}>
        <Typography variant="h6">AI Assistant</Typography>
        <IconButton 
          onClick={clearChat} 
          color="default" 
          disabled={messages.length === 0 || isLoading}
          title="Clear chat"
        >
          <DeleteIcon />
        </IconButton>
      </Box>
      
      <Paper 
        sx={{ 
          flex: 1, 
          mb: 2, 
          p: 2, 
          overflow: 'auto',
          backgroundColor: 'background.default',
          borderRadius: 2
        }}
      >
        {messages.length === 0 ? (
          <Box 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center',
              color: 'text.secondary'
            }}
          >
            <Typography variant="body1" sx={{ mb: 1 }}>
              Welcome to AI Chat
            </Typography>
            <Typography variant="body2">
              Ask me anything to help with your productivity tasks
            </Typography>
          </Box>
        ) : (
          <Box>
            {messages.map((message, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box 
                  sx={{ 
                    display: 'flex',
                    alignItems: 'flex-start',
                    mb: 0.5
                  }}
                >
                  <Avatar 
                    sx={{ 
                      mr: 1, 
                      bgcolor: message.sender === 'ai' ? 'primary.main' : 'secondary.main',
                      width: 32,
                      height: 32
                    }}
                  >
                    {message.sender === 'ai' ? 'AI' : 'U'}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'break-word'
                      }}
                    >
                      {message.content}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ display: 'block', mt: 0.5 }}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </Typography>
                  </Box>
                </Box>
                {index < messages.length - 1 && (
                  <Divider sx={{ my: 2 }} />
                )}
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>
        )}
      </Paper>
      
      <Paper 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center',
          borderRadius: 2
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={handleInputChange}
          disabled={isLoading}
          autoFocus
          sx={{ mr: 1 }}
        />
        <Button 
          type="submit" 
          variant="contained" 
          disabled={!input.trim() || isLoading}
          endIcon={isLoading ? <CircularProgress size={20} /> : <SendIcon />}
        >
          Send
        </Button>
      </Paper>
    </Box>
  );
};

export default AIChatPage;