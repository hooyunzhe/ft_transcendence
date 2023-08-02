'use client';
import { useChannelActions } from '@/lib/stores/useChannelStore';
import DialogPrompt from '../utils/LegacyDialogPrompt';
import { useState } from 'react';
import callAPI from '@/lib/callAPI';
import emitToSocket from '@/lib/emitToSocket';
import { useChannelSocket } from '@/lib/stores/useSocketStore';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';
import { useDialogActions } from '@/lib/stores/useDialogStore';
import { Button, Stack, TextField } from '@mui/material';
import { ChannelMembers } from '@/types/ChannelMemberTypes';
import BanListDisplay from '../channel-member/ChannelMemberBanListDisplay';

interface ChannelNameChangeProps {
  channelID: number;
}

export default function ChannelNameChangePrompt({
  channelID,
}: ChannelNameChangeProps) {
  const { changeChannelName } = useChannelActions();
  const { displayNotification } = useNotificationActions();
  const [input, setInput] = useState('');
  const channelSocket = useChannelSocket();
  const { setDialogPrompt, resetDialog } = useDialogActions();

  async function changeName(channelID: number, newName: string) {
    const data = {
      id: channelID,
      newName: newName,
    };
    await callAPI('PATCH', 'channels', data);
    changeChannelName(channelID, newName);
    emitToSocket(channelSocket, 'changeChannelName', data);
    displayNotification('success', 'Channel name changed');
  }

  return (
    <Button
      onClick={() =>
        setDialogPrompt(
          true,
          'Change Channel Name',
          'Please provide name you want to change to.',
          'Cancel',
          () => {
            resetDialog();
            setInput('');
          },
          'Change',
          async () => {
            changeName(channelID, input);
          },
          <TextField
            onChange={(event) => {
              setInput(event.target.value);
            }}
            margin='dense'
            id='standard-basic'
            label='Standard'
            variant='standard'
            fullWidth
          />,
        )
      }
    >
      Change Channel Name
    </Button>
  );
}
