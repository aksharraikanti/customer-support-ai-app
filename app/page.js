"use client";

import { Box, Button, Stack, TextField } from '@mui/material'
import { useState } from 'react'
import { useEffect, useRef } from 'react'

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Purdue University Housing support assistant. How can I help you today?",
    },
  ])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!message.trim() || isLoading) {
      setMessages(messages => [...messages, { role: 'assistant', content: "Please enter a message before sending." }]);
      return;
    }
  
    setIsLoading(true);
    setMessage('');
    
    const newMessages = [...messages, { role: 'user', content: message }];
    setMessages([...newMessages, { role: 'assistant', content: '' }]);
  
    try {
      const response = await fetch('/api/llama', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
  
      if (!response.ok) throw new Error('Network response was not ok');
  
      const data = await response.json();
      setMessages(messages => [...messages.slice(0, -1), { role: 'assistant', content: data.content }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(messages => [...messages, { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  

  
  
  

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="#1a1a1a"
      sx={{
        backgroundImage: 'linear-gradient(120deg, #2e2e2e, #1a1a1a)',
      }}
    >
      <Stack
        direction="column"
        width="400px"
        height="600px"
        border="none"
        borderRadius={2}
        p={2}
        spacing={3}
        bgcolor="#333333"
        boxShadow="0px 0px 20px rgba(0, 0, 0, 0.5)"
      >
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
          sx={{
            '::-webkit-scrollbar': {
              width: '5px',
            },
            '::-webkit-scrollbar-thumb': {
              backgroundColor: '#555',
              borderRadius: '10px',
            },
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
              mt={1}
            >
              <Box
                bgcolor={
                  message.role === 'assistant'
                    ? '#005f73'
                    : '#0a9396'
                }
                color="#ffffff"
                borderRadius={2}
                p={2}
                maxWidth="80%"
                sx={{
                  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
                  fontFamily: 'Arial, sans-serif',
                  fontSize: '0.9rem',
                  lineHeight: 1.4,
                }}
              >
                {message.content}
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Type a message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            InputLabelProps={{ style: { color: '#cccccc' } }}
            InputProps={{
              style: { color: '#ffffff' },
              sx: {
                backgroundColor: '#444444',
                borderRadius: '10px',
              },
            }}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#555555',
                },
                '&:hover fieldset': {
                  borderColor: '#ffffff',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ffffff',
                },
              },
            }}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={isLoading}
            sx={{
              bgcolor: '#0a9396',
              '&:hover': {
                bgcolor: '#94d2bd',
              },
              color: '#ffffff',
              padding: '10px 20px',
              borderRadius: '10px',
              boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
              minWidth: '80px',
            }}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
