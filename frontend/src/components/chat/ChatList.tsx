'use client';
import { Stack, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';
import ChatDisplay from './ChatDisplay';
import { useCurrentSocialTab } from '@/lib/stores/useUtilStore';
import { useSelectedChannel } from '@/lib/stores/useChannelStore';
import { useMessages } from '@/lib/stores/useChatStore';

export default function ChatList() {
  const currentSocialTab = useCurrentSocialTab();
  const selectedChannel = useSelectedChannel();
  const messages = useMessages();
  const chatStack = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const chatStackElement = chatStack.current;

    if (chatStackElement) {
      chatStackElement.scrollTop = chatStackElement.scrollHeight;
    }
  }, [selectedChannel, messages]);

  return (
    <Stack
      sx={{ overflow: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}
      height='100%'
      padding='10px'
      spacing={1}
      ref={chatStack}
    >
      {selectedChannel ? (
        messages
          .filter((message) => message.channel.id === selectedChannel.id)
          .map((message, index) => (
            <ChatDisplay
              key={index}
              content={message.content}
              type={message.type}
              dateOfCreation={message.date_of_creation}
              senderName={message.user.username}
              avatarUrl={message.user.avatar_url}
            />
          ))
      ) : (
        <Typography
          sx={{
            opacity: '50%',
          }}
          variant='h5'
          align='center'
          marginTop='26vh'
        >
          Select a {currentSocialTab.toLowerCase()} to view messages
        </Typography>
      )}
    </Stack>
  );
}
