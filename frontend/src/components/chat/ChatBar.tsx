'use client';
import callAPI from '@/lib/callAPI';
import emitToSocket from '@/lib/emitToSocket';
import { useChannelMemberActions } from '@/lib/stores/useChannelMemberStore';
import { useChatActions, useTypingMembers } from '@/lib/stores/useChatStore';
import { useChannelSocket } from '@/lib/stores/useSocketStore';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import { Channel } from '@/types/ChannelTypes';
import { MessageType } from '@/types/MessageTypes';
import { Box, ListItemText, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

interface ChatBarProps {
  channel: Channel;
}

export default function ChatBar({ channel }: ChatBarProps) {
  const currentUser = useCurrentUser();
  const { getChannelMember } = useChannelMemberActions();
  const { addMessage } = useChatActions();
  const channelSocket = useChannelSocket();
  const typingMembers = useTypingMembers();
  const [message, setMessage] = useState('');
  const [typingTimeoutID, setTypingTimeoutID] = useState<
    NodeJS.Timeout | undefined
  >(undefined);
  const [isTypingText, setIsTypingText] = useState('');
  const [isTypingIntervalID, setIsTypingIntervalID] = useState<
    NodeJS.Timer | undefined
  >(undefined);

  useEffect(() => {
    switch (typingMembers.length) {
      case 0:
        clearInterval(isTypingIntervalID);
        setIsTypingText('');
        break;
      case 1:
        setIsTypingText(typingMembers[0].user.username + ' is typing');
        break;
      case 2:
        setIsTypingText(
          typingMembers
            .map((typingMember) => typingMember.user.username)
            .join(' and ') + ' are typing',
        );
        break;
      default:
        setIsTypingText('Many are typing');
        break;
    }

    if (typingMembers.length) {
      clearInterval(isTypingIntervalID);
      setIsTypingIntervalID(
        setInterval(() => {
          setIsTypingText((isTypingText) => {
            return isTypingText.length - isTypingText.lastIndexOf('g') < 4
              ? isTypingText + '.'
              : isTypingText.slice(0, isTypingText.lastIndexOf('g') + 1);
          });
        }, 500),
      );
    }
  }, [typingMembers]);

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
        secondary={isTypingText}
      />
      <TextField
        sx={{
          background: '#4CC9F075',
        }}
        fullWidth
        onChange={(event) => {
          if (!typingTimeoutID) {
            emitToSocket(
              channelSocket,
              'startTyping',
              getChannelMember(currentUser.id, channel.id),
            );
          }
          clearTimeout(typingTimeoutID);
          setTypingTimeoutID(
            setTimeout(() => {
              emitToSocket(
                channelSocket,
                'stopTyping',
                getChannelMember(currentUser.id, channel.id),
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
              getChannelMember(currentUser.id, channel.id),
            );
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
