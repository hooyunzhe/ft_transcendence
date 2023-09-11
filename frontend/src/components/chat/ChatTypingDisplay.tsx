'use client';
import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelectedChannel } from '@/lib/stores/useChannelStore';
import { useTypingMembers } from '@/lib/stores/useChatStore';
import { useCurrentUser } from '@/lib/stores/useUserStore';

export default function ChatTypingDisplay() {
  const selectedChannel = useSelectedChannel();
  const typingMembers = useTypingMembers();
  const currentUser = useCurrentUser();
  const [isTypingText, setIsTypingText] = useState('');
  const [isTypingDots, setIsTypingDots] = useState(0);
  const [isTypingIntervalID, setIsTypingIntervalID] = useState<
    NodeJS.Timer | undefined
  >();

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
        setIsTypingText(
          filteredTypingMembers[0].user.id === currentUser.id
            ? 'You are typing from another window'
            : filteredTypingMembers[0].user.username + ' is typing',
        );
        break;
      case 2:
        setIsTypingText(
          filteredTypingMembers
            .map((typingMember, index) =>
              typingMember.user.id === currentUser.id
                ? index === 0
                  ? 'You'
                  : 'you'
                : typingMember.user.username,
            )
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
        setInterval(
          () => setIsTypingDots((prev) => (prev < 3 ? prev + 1 : 0)),
          500,
        ),
      );
    }
  }, [selectedChannel, typingMembers]);

  return (
    <Typography
      sx={{ padding: '3px 12px', color: '#DDDDDD', opacity: '70%' }}
      variant='subtitle2'
    >
      {isTypingText && isTypingText + '.'.repeat(isTypingDots)}
    </Typography>
  );
}
