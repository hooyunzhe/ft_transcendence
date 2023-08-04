'use client';
import { TextField } from '@mui/material';
import { useState } from 'react';
import callAPI from '@/lib/callAPI';
import emitToSocket from '@/lib/emitToSocket';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import {
  useChannelActions,
  useSelectedChannel,
} from '@/lib/stores/useChannelStore';
import { useSelectedFriend } from '@/lib/stores/useFriendStore';
import { useCurrentSocialTab } from '@/lib/stores/useUtilStore';
import { useChannelMemberActions } from '@/lib/stores/useChannelMemberStore';
import { useChatActions } from '@/lib/stores/useChatStore';
import { useChannelSocket } from '@/lib/stores/useSocketStore';
import { MessageType } from '@/types/MessageTypes';
import { ChannelType } from '@/types/ChannelTypes';

export default function ChatBar() {
  const currentUser = useCurrentUser();
  const selectedChannel = useSelectedChannel();
  const selectedFriend = useSelectedFriend();
  const currentSocialTab = useCurrentSocialTab();
  const { getChannelMember } = useChannelMemberActions();
  const { addMessage } = useChatActions();
  const { updateRecentChannelActivity } = useChannelActions();
  const channelSocket = useChannelSocket();
  const [unsentMessages, setUnsentMessages] = useState<string[]>([]);
  const [typingTimeoutID, setTypingTimeoutID] = useState<
    NodeJS.Timeout | undefined
  >();

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
          const updatedUnsentMessages = [...unsentMessages];

          updatedUnsentMessages[selectedChannel.id] = '';
          return updatedUnsentMessages;
        });
        addMessage(newMessage);
        updateRecentChannelActivity(selectedChannel.id);
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
      autoComplete='off'
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
          ? 'Message ' +
            (selectedChannel.type === ChannelType.DIRECT
              ? selectedFriend?.incoming_friend.username
              : selectedChannel.name)
          : `Select a ${currentSocialTab.toLowerCase()} to start messaging`
      }
      variant='filled'
      color='secondary'
    />
  );
}
