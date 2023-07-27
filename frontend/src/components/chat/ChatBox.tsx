'use client';
import { Box, Stack, Typography } from '@mui/material';
import ChatDisplay from './ChatDisplay';
import { useSelectedChannel } from '@/lib/stores/useChannelStore';
import ChatHeader from './ChatHeader';
import { useMessages } from '@/lib/stores/useChatStore';
import ChatBar from './ChatBar';

export default function ChatBox() {
  const messages = useMessages();
  const selectedChannel = useSelectedChannel();

  return selectedChannel ? (
    <Box display='flex' height='100%' flexDirection='column'>
      <ChatHeader channelName={selectedChannel.name} />
      <Stack padding='10px' spacing={1} overflow='scroll'>
        {messages
          .filter((message) => message.channel.id === selectedChannel.id)
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
      <ChatBar channel={selectedChannel} />
    </Box>
  ) : (
    <Box
      display='flex'
      height='100%'
      justifyContent='center'
      alignItems='center'
    >
      <Typography sx={{ opacity: '50%' }} variant='h5'>
        Select a channel to view messages
      </Typography>
    </Box>
  );
}
