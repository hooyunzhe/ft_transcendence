'use client';
import callAPI from '@/lib/callAPI';
import emitToSocket from '@/lib/emitToSocket';
import { useChannelMemberActions } from '@/lib/stores/useChannelMemberStore';
import { useSelectedChannel } from '@/lib/stores/useChannelStore';
import { useChatActions } from '@/lib/stores/useChatStore';
import { useChannelSocket } from '@/lib/stores/useSocketStore';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import { MessageType } from '@/types/MessageTypes';
import { TextField } from '@mui/material';
import { useState } from 'react';

export default function ChatBar() {
  const currentUser = useCurrentUser();
  const selectedChannel = useSelectedChannel();
  const { getChannelMember } = useChannelMemberActions();
  const { addMessage } = useChatActions();
  const channelSocket = useChannelSocket();
  const [message, setMessage] = useState('');
  const [typingTimeoutID, setTypingTimeoutID] = useState<
    NodeJS.Timeout | undefined
  >(undefined);

  async function sendMessage(): Promise<void> {
    const newMessage = JSON.parse(
      await callAPI('POST', 'messages', {
        channel_id: selectedChannel?.id,
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
    <TextField
      sx={{
        background: '#4CC9F075',
      }}
      fullWidth
      disabled={selectedChannel === undefined}
      onChange={(event) => {
        if (!typingTimeoutID) {
          emitToSocket(
            channelSocket,
            'startTyping',
            getChannelMember(currentUser.id, selectedChannel?.id ?? 0),
          );
        }
        clearTimeout(typingTimeoutID);
        setTypingTimeoutID(
          setTimeout(() => {
            emitToSocket(
              channelSocket,
              'stopTyping',
              getChannelMember(currentUser.id, selectedChannel?.id ?? 0),
            );
            setTypingTimeoutID(undefined);
          }, 2000),
        );
        setMessage(event.target.value);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' && message) {
          emitToSocket(
            channelSocket,
            'stopTyping',
            getChannelMember(currentUser.id, selectedChannel?.id ?? 0),
          );
          clearTimeout(typingTimeoutID);
          setTypingTimeoutID(undefined);
          sendMessage();
          setMessage('');
        }
      }}
      value={message}
      label={
        selectedChannel
          ? 'Message ' + selectedChannel.name
          : 'Select a channel start messaging'
      }
      variant='filled'
      color='secondary'
    />
  );
}
