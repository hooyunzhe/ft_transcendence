'use client';
import { Box } from '@mui/material';
import ChatHeader from './ChatHeader';
import ChatList from './ChatList';
import ChatTypingDisplay from './ChatTypingDisplay';
import ChatBar from './ChatBar';

export default function ChatBox() {
  return (
    <Box
      display='flex'
      height='100%'
      flexDirection='column'
      justifyContent='space-between'
    >
      <ChatHeader />
      <ChatList />
      <ChatTypingDisplay />
      <ChatBar />
    </Box>
  );
}
