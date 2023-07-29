'use client';
import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelectedChannel } from '@/lib/stores/useChannelStore';
import { useTypingMembers } from '@/lib/stores/useChatStore';

export default function ChatTypingDisplay() {
  const selectedChannel = useSelectedChannel();
  const typingMembers = useTypingMembers();
  const [isTypingText, setIsTypingText] = useState('');
  const [isTypingIntervalID, setIsTypingIntervalID] = useState<
    NodeJS.Timer | undefined
  >(undefined);

  useEffect(() => {
    const filteredTypingMembers = typingMembers.filter(
      (typingMember) => typingMember.channel.id === selectedChannel?.id,
    );

    switch (filteredTypingMembers.length) {
      case 0:
        clearInterval(isTypingIntervalID);
        setIsTypingText('');
        break;
      case 1:
        setIsTypingText(filteredTypingMembers[0].user.username + ' is typing');
        break;
      case 2:
        setIsTypingText(
          filteredTypingMembers
            .map((typingMember) => typingMember.user.username)
            .join(' and ') + ' are typing',
        );
        break;
      default:
        setIsTypingText('Many are typing');
        break;
    }

    if (filteredTypingMembers.length) {
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
  }, [selectedChannel, typingMembers]);

  return (
    <Typography
      sx={{ padding: '3px 12px', opacity: '70%' }}
      variant='subtitle2'
    >
      {isTypingText}
    </Typography>
  );
}
