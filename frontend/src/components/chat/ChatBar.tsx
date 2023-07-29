'use client';
import { TextField } from '@mui/material';
import { useState } from 'react';
import callAPI from '@/lib/callAPI';
import emitToSocket from '@/lib/emitToSocket';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import { useSelectedChannel } from '@/lib/stores/useChannelStore';
import { useChannelMemberActions } from '@/lib/stores/useChannelMemberStore';
import { useChatActions } from '@/lib/stores/useChatStore';
import { useChannelSocket } from '@/lib/stores/useSocketStore';
import { MessageType } from '@/types/MessageTypes';

export default function ChatBar() {
  const currentUser = useCurrentUser();
  const selectedChannel = useSelectedChannel();
  const { getChannelMember } = useChannelMemberActions();
  const { addMessage } = useChatActions();
  const channelSocket = useChannelSocket();
  const [unsentMessages, setUnsentMessages] = useState<string[]>([]);
  const [typingTimeoutID, setTypingTimeoutID] = useState<
    NodeJS.Timeout | undefined
  >(undefined);

  function handleInputChange(input: string): void {
    if (selectedChannel) {
      if (!typingTimeoutID) {
        emitToSocket(
          channelSocket,
          'startTyping',
          getChannelMember(currentUser.id, selectedChannel.id),
        );
      }
      clearTimeout(typingTimeoutID);
      setTypingTimeoutID(
        setTimeout(() => {
          emitToSocket(
            channelSocket,
            'stopTyping',
            getChannelMember(currentUser.id, selectedChannel.id),
          );
          setTypingTimeoutID(undefined);
        }, 2000),
      );
      setUnsentMessages((unsentMessages) => {
        unsentMessages[selectedChannel.id] = input;
        console.log(unsentMessages);
        return unsentMessages;
      });
    } else {
      console.log('FATAL ERROR: NO CHANNEL IS SELECTED');
    }
  }

  function handleKeyDown(key: string): void {
    if (selectedChannel) {
      if (key === 'Enter' && unsentMessages[selectedChannel.id]) {
        emitToSocket(
          channelSocket,
          'stopTyping',
          getChannelMember(currentUser.id, selectedChannel.id),
        );
        clearTimeout(typingTimeoutID);
        setTypingTimeoutID(undefined);
        sendMessage();
      }
    } else {
      console.log('FATAL ERROR: NO CHANNEL IS SELECTED');
    }
  }

  async function sendMessage(): Promise<void> {
    if (selectedChannel) {
      const newMessage = JSON.parse(
        await callAPI('POST', 'messages', {
          channel_id: selectedChannel.id,
          user_id: currentUser.id,
          content: unsentMessages[selectedChannel.id],
          type: MessageType.TEXT,
        }),
      );

      if (newMessage) {
        setUnsentMessages((unsentMessages) => {
          unsentMessages[selectedChannel.id] = '';
          return unsentMessages;
        });
        addMessage(newMessage);
        emitToSocket(channelSocket, 'newMessage', newMessage);
      } else {
        console.log('FATAL ERROR: FAILED TO SEND MESSAGE IN BACKEND');
      }
    } else {
      console.log('FATAL ERROR: NO CHANNEL IS SELECTED');
    }
  }

  return (
    <TextField
      sx={{
        background: '#4CC9F075',
      }}
      fullWidth
      disabled={selectedChannel === undefined}
      onChange={(event) => handleInputChange(event.target.value)}
      onKeyDown={(event) => handleKeyDown(event.key)}
      value={
        selectedChannel && unsentMessages[selectedChannel.id]
          ? unsentMessages[selectedChannel.id]
          : ''
      }
      label={
        selectedChannel
          ? 'Message ' + selectedChannel.name
          : 'Select a channel to start messaging'
      }
      variant='filled'
      color='secondary'
    />
  );
}
