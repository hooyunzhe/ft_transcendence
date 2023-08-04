'use client';
import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import callAPI from '@/lib/callAPI';
import emitToSocket from '@/lib/emitToSocket';
import { useChannelSocket } from '@/lib/stores/useSocketStore';
import { useChannelActions } from '@/lib/stores/useChannelStore';
import {
  useDialogActions,
  useDialogTriggers,
} from '@/lib/stores/useDialogStore';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';

interface ChannelNameChangeProps {
  channelID: number;
}

export default function ChannelNameChangePrompt({
  channelID,
}: ChannelNameChangeProps) {
  const { changeChannelName } = useChannelActions();
  const channelSocket = useChannelSocket();
  const { actionClicked, backClicked } = useDialogTriggers();
  const { resetDialog } = useDialogActions();
  const { displayNotification } = useNotificationActions();
  const [newName, setNewName] = useState('');

  async function handleNameChange() {
    const data = {
      id: channelID,
      newName: newName,
    };
    await callAPI('PATCH', 'channels', data);
    changeChannelName(channelID, newName);
    emitToSocket(channelSocket, 'changeChannelName', data);
    displayNotification('success', 'Channel name changed');
  }

  useEffect(() => {
    if (actionClicked) {
      handleNameChange().then(() => resetDialog());
    }
    if (backClicked) {
      resetDialog();
    }
  }, [actionClicked, backClicked]);

  return (
    <TextField
      fullWidth
      autoComplete='off'
      variant='standard'
      margin='dense'
      label='Channel Name'
      value={newName}
      onChange={(event) => {
        setNewName(event.target.value);
      }}
    />
  );
}
