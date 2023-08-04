'use client';
import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import callAPI from '@/lib/callAPI';
import emitToSocket from '@/lib/emitToSocket';
import { useChannelActions } from '@/lib/stores/useChannelStore';
import { useChannelSocket } from '@/lib/stores/useSocketStore';
import {
  useDialogActions,
  useDialogTriggers,
} from '@/lib/stores/useDialogStore';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';

interface ChannelDeletePromptProps {
  channelID: number;
  channelName: string;
}

export default function ChannelDeletePrompt({
  channelID,
  channelName,
}: ChannelDeletePromptProps) {
  const { deleteChannel } = useChannelActions();
  const { displayNotification } = useNotificationActions();
  const channelSocket = useChannelSocket();
  const { actionClicked, backClicked } = useDialogTriggers();
  const { resetTriggers, resetDialog } = useDialogActions();
  const [nameConfirm, setNameConfirm] = useState('');

  async function deleteChannelApproved(): Promise<void> {
    if (nameConfirm !== channelName) {
      throw "Confirmation doesn't match channel name";
    }

    await callAPI('DELETE', 'channels', { id: channelID });
    deleteChannel(channelID);
    emitToSocket(channelSocket, 'deleteChannel', channelID);
    displayNotification('error', 'Channel deleted');
  }

  useEffect(() => {
    if (actionClicked) {
      deleteChannelApproved()
        .then(() => resetDialog())
        .catch((error) => {
          resetTriggers();
          displayNotification('error', error);
        });
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
      label='Confirm Channel Name'
      value={nameConfirm}
      onChange={(event) => setNameConfirm(event.target.value)}
    />
  );
}
