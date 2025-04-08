// src/components/AIChat/AIChatPage.tsx
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
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Drawer,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  useMediaQuery,
  useTheme,
  Tooltip
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import { aiService } from '../../services/aiService';
 // @ts-ignore-unused
import { chatService, Chat, ChatMessage } from '../../services/chatService';

// Interface for local messages
interface Message {
  id?: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  contentBlocks?: any[];
}

const drawerWidth = 280;

const AIChatPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(!isMobile);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [renameChatTitle, setRenameChatTitle] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chats on component mount
  useEffect(() => {
    loadChats();
  }, []);

  // Handle window resize for drawer
  useEffect(() => {
    setIsDrawerOpen(!isMobile);
  }, [isMobile]);

  // Load chat messages when selected chat changes
  useEffect(() => {
    if (selectedChat) {
      loadChatMessages(selectedChat.id);
    } else {
      setMessages([]);
    }
  }, [selectedChat]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadChats = async () => {
    setIsLoadingChats(true);
    try {
      const fetchedChats = await chatService.getChats();
      setChats(fetchedChats);
      
      // Select the most recent chat if available
      if (fetchedChats.length > 0 && !selectedChat) {
        setSelectedChat(fetchedChats[0]);
      }
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setIsLoadingChats(false);
    }
  };

  const loadChatMessages = async (chatId: string) => {
    setIsLoading(true);
    try {
      const chatMessages = await chatService.getChatMessages(chatId);
      
      // Convert to local message format
      const convertedMessages: Message[] = chatMessages.map(msg => ({
        id: msg.id,
        content: msg.content,
        sender: msg.sender,
        timestamp: new Date(msg.created_at || Date.now()),
        contentBlocks: msg.content_blocks
      }));
      
      setMessages(convertedMessages);
    } catch (error) {
      console.error('Error loading chat messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleCreateChat = async () => {
    try {
      let title = newChatTitle.trim();
      if (!title) {
        title = 'New Chat';
      }
      
      const newChat = await chatService.createChat(title);
      setChats([newChat, ...chats]);
      setSelectedChat(newChat);
      setIsCreatingChat(false);
      setNewChatTitle('');
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const handleRenameChat = async () => {
    if (!selectedChat) return;
    
    try {
      const title = renameChatTitle.trim() || 'Untitled Chat';
      const updatedChat = await chatService.updateChat(selectedChat.id, title);
      
      setChats(chats.map(chat => 
        chat.id === updatedChat.id ? updatedChat : chat
      ));
      
      setSelectedChat(updatedChat);
      setIsEditingTitle(false);
    } catch (error) {
      console.error('Error renaming chat:', error);
    }
  };

  const handleDeleteChat = async () => {
    if (!selectedChat) return;
    
    try {
      await chatService.deleteChat(selectedChat.id);
      
      // Remove chat from list
      const updatedChats = chats.filter(chat => chat.id !== selectedChat.id);
      setChats(updatedChats);
      
      // Select a new chat if available
      if (updatedChats.length > 0) {
        setSelectedChat(updatedChats[0]);
      } else {
        setSelectedChat(null);
      }
      
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || !selectedChat) return;
    
    // If no selected chat, create one first
    let chatId = selectedChat?.id;
    if (!chatId) {
      try {
        const newChat = await chatService.createChat('New Chat');
        setChats([newChat, ...chats]);
        setSelectedChat(newChat);
        chatId = newChat.id;
      } catch (error) {
        console.error('Error creating chat:', error);
        return;
      }
    }
    
    const userContent = input.trim();
    setInput('');
    setIsLoading(true);
    
    // Add user message to chat
    const userMessage: Message = {
      content: userContent,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      // Save user message to database
      await chatService.addMessage(chatId, {
        content: userContent,
        sender: 'user'
      });
      
      // Prepare previous messages for context
      const previousMessages = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));
      
      // Get AI response
      const response = await aiService.sendMessage(userContent, previousMessages);
      
      // Create AI message
      const aiMessage: Message = {
        content: response.text,
        sender: 'ai',
        timestamp: new Date(),
        contentBlocks: response.contentBlocks
      };
      
      // Add AI message to UI
      setMessages(prev => [...prev, aiMessage]);
      
      // Save AI message to database
      await chatService.addMessage(chatId, {
        content: response.text,
        sender: 'ai',
        content_blocks: response.contentBlocks
      });
      
      // Update chats list to reflect latest activity
      loadChats();
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Add error message
      const errorMessage: Message = {
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      // Save error message to database
      if (selectedChat) {
        try {
          await chatService.addMessage(selectedChat.id, {
            content: errorMessage.content,
            sender: 'ai'
          });
        } catch (e) {
          console.error('Failed to save error message:', e);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatChatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const chatListDrawer = (
    <Box sx={{ width: drawerWidth, overflow: 'auto' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">AI Chats</Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => setIsCreatingChat(true)}
        >
          New Chat
        </Button>
      </Box>
      
      {isCreatingChat && (
        <Box sx={{ p: 2, pb: 3 }}>
          <TextField
            fullWidth
            size="small"
            label="Chat Title"
            value={newChatTitle}
            onChange={(e) => setNewChatTitle(e.target.value)}
            placeholder="New Chat"
            autoFocus
            sx={{ mb: 1 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button size="small" onClick={() => setIsCreatingChat(false)}>
              Cancel
            </Button>
            <Button 
              size="small" 
              variant="contained" 
              onClick={handleCreateChat}
            >
              Create
            </Button>
          </Box>
        </Box>
      )}
      
      <Divider />
      
      {isLoadingChats ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress size={24} />
        </Box>
      ) : chats.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            No chats yet
          </Typography>
        </Box>
      ) : (
        <List>
          {chats.map((chat) => (
            <ListItem 
              key={chat.id} 
              disablePadding
              secondaryAction={
                selectedChat?.id === chat.id && (
                  <IconButton 
                    edge="end" 
                    aria-label="delete"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )
              }
            >
              <ListItemButton
                selected={selectedChat?.id === chat.id}
                onClick={() => {
                  setSelectedChat(chat);
                  if (isMobile) {
                    setIsDrawerOpen(false);
                  }
                }}
              >
                <ListItemText 
                  primary={chat.title}
                  secondary={formatChatDate(chat.last_updated)}
                  primaryTypographyProps={{
                    noWrap: true,
                    fontWeight: selectedChat?.id === chat.id ? 500 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );

  return (
    <Box sx={{ height: '100%', display: 'flex' }}>
      {/* Chat list drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {chatListDrawer}
      </Drawer>
      
      {/* Main chat area */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden'
      }}>
        {/* Chat header */}
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isMobile && (
              <IconButton onClick={() => setIsDrawerOpen(true)} edge="start">
                <MenuIcon />
              </IconButton>
            )}
            
            {isEditingTitle ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  size="small"
                  value={renameChatTitle}
                  onChange={(e) => setRenameChatTitle(e.target.value)}
                  autoFocus
                />
                <Button size="small" onClick={() => setIsEditingTitle(false)}>
                  Cancel
                </Button>
                <Button 
                  size="small" 
                  variant="contained" 
                  onClick={handleRenameChat}
                >
                  Save
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6">
                  {selectedChat?.title || 'New Chat'}
                </Typography>
                {selectedChat && (
                  <Tooltip title="Rename chat">
                    <IconButton 
                      size="small" 
                      onClick={() => {
                        setRenameChatTitle(selectedChat.title);
                        setIsEditingTitle(true);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            )}
          </Box>
          
          {selectedChat && !isEditingTitle && (
            <Box>
              <Tooltip title="Clear chat">
                <IconButton 
                  onClick={() => setDeleteDialogOpen(true)}
                  color="default"
                  disabled={isLoading}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
        
        {/* Messages area */}
        <Paper 
          sx={{ 
            flex: 1, 
            mb: 2, 
            mx: 2,
            mt: 2,
            p: 2, 
            overflow: 'auto',
            backgroundColor: 'background.default',
            borderRadius: 2
          }}
        >
          {!selectedChat || messages.length === 0 ? (
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
                {selectedChat ? 'Start a new conversation' : 'Select or create a chat'}
              </Typography>
              <Typography variant="body2">
                {selectedChat ? 'Ask me anything to help with your productivity tasks' : 'Use the sidebar to manage your conversations'}
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
                        {formatTimestamp(message.timestamp)}
                      </Typography>
                    </Box>
                  </Box>
                  {index < messages.length - 1 && (
                    <Divider sx={{ my: 2 }} />
                  )}
                </Box>
              ))}
              {isLoading && (
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 5 }}>
                  <CircularProgress size={20} sx={{ mr: 2 }} />
                  <Typography variant="body2">AI is thinking...</Typography>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>
          )}
        </Paper>
        
        {/* Message input */}
        <Paper 
          component="form" 
          onSubmit={handleSubmit}
          sx={{ 
            p: 2, 
            mx: 2,
            mb: 2,
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
            disabled={isLoading || !selectedChat}
            autoFocus
            sx={{ mr: 1 }}
            InputProps={{
              endAdornment: isLoading && (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              )
            }}
          />
          <Button 
            type="submit" 
            variant="contained" 
            disabled={!input.trim() || isLoading || !selectedChat}
            endIcon={<SendIcon />}
          >
            Send
          </Button>
        </Paper>
      </Box>
      
      {/* Delete chat confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Chat</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this chat? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteChat} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AIChatPage;