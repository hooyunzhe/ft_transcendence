'use client';
import { useMessages } from '@/lib/stores/useChatStore';
import { Stack } from '@mui/material';
import { useEffect, useRef } from 'react';
import ChatDisplay from './ChatDisplay';

interface ChatListProps {
  channelID: number;
}

export default function ChatList({ channelID }: ChatListProps) {
  const messages = useMessages();
  const chatStack = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const chatStackElement = chatStack.current;

    if (chatStackElement) {
      chatStackElement.scrollTop = chatStackElement.scrollHeight;
    }
  }, [messages]);

  return (
    <Stack
      sx={{ overflow: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}
      padding='10px'
      spacing={1}
      ref={chatStack}
    >
      {messages
        .filter((message) => message.channel.id === channelID)
        .map((message, index) => (
          <ChatDisplay
            key={index}
            content={message.content}
            type={message.type}
            dateOfCreation={message.date_of_creation}
            senderName={message.user.username}
          />
        ))}
    </Stack>
  );
}
