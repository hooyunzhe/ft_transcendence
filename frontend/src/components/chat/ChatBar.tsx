'use client';
import callAPI from '@/lib/callAPI';
import emitToSocket from '@/lib/emitToSocket';
import { useChatActions } from '@/lib/stores/useChatStore';
import { useChannelSocket } from '@/lib/stores/useSocketStore';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import { Channel } from '@/types/ChannelTypes';
import { MessageType } from '@/types/MessageTypes';
import { Box, ListItemText, TextField } from '@mui/material';
import { useState } from 'react';

interface ChatBarProps {
  channel: Channel;
}

export default function ChatBar({ channel }: ChatBarProps) {
  const currentUser = useCurrentUser();
  const [message, setMessage] = useState('');
  const { addMessage } = useChatActions();
  const channelSocket = useChannelSocket();

  async function sendMessage(): Promise<void> {
    const newMessage = JSON.parse(
      await callAPI('POST', 'messages', {
        channel_id: channel.id,
        user_id: currentUser.id,
        content: message,
        type: MessageType.TEXT,
      }),
    );

    if (newMessage) {
      addMessage(newMessage);
      emitToSocket(channelSocket, 'newMessage', newMessage);
    } else {
      console.log('FATAL ERROR: FAILED TO SEND MESSAGE IN BACKEND');
    }
  }

  return (
    <Box marginTop='auto'>
      <ListItemText
        sx={{ minHeight: '20px', paddingLeft: '12px' }}
        secondary='User is typing...'
      />
      <TextField
        sx={{
          background: '#4CC9F075',
        }}
        fullWidth
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && message) {
            sendMessage();
            setMessage('');
          }
        }}
        value={message}
        label={'Message ' + channel.name}
        variant='filled'
        color='secondary'
      />
    </Box>
  );
}
