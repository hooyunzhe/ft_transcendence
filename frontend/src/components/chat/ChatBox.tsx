'use client';
import { Box, Typography } from '@mui/material';
import { useSelectedChannel } from '@/lib/stores/useChannelStore';
import ChatHeader from './ChatHeader';
import ChatBar from './ChatBar';
import ChatList from './ChatList';
import ChatTypingDisplay from './ChatTypingDisplay';

export default function ChatBox() {
  const selectedChannel = useSelectedChannel();

  return (
    <Box
      display='flex'
      height='100%'
      flexDirection='column'
      justifyContent='space-between'
    >
      <ChatHeader
        channelName={selectedChannel?.name ?? 'No Channel Selected'}
      />
      {selectedChannel ? (
        <ChatList channelID={selectedChannel.id} />
      ) : (
        <Typography
          sx={{
            opacity: '50%',
          }}
          variant='h5'
          align='center'
        >
          Select a channel to view messages
        </Typography>
      )}
      <ChatTypingDisplay />
      <ChatBar />
    </Box>
  );
}
