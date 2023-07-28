'use client';
import { useTypingMembers } from '@/lib/stores/useChatStore';
import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';

export default function ChatTypingDisplay() {
  const typingMembers = useTypingMembers();
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

  return (
    <Typography
      sx={{ padding: '3px 12px', opacity: '70%' }}
      variant='subtitle2'
    >
      {isTypingText}
    </Typography>
  );
}
