'use client';
import { useEffect, useState } from 'react';
import InputField from '../utils/InputField';
import callAPI from '@/lib/callAPI';
import emitToSocket from '@/lib/emitToSocket';
import { useChannelSocket } from '@/lib/stores/useSocketStore';
import { useChannelActions } from '@/lib/stores/useChannelStore';
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
  const channelSocket = useChannelSocket();
  const { deleteChannel, resetSelectedChannel } = useChannelActions();
  const { actionClicked, backClicked } = useDialogTriggers();
  const { setActionButtonDisabled, resetTriggers, resetDialog } =
    useDialogActions();
  const { displayNotification } = useNotificationActions();
  const [nameConfirm, setNameConfirm] = useState('');

  function handleConfirmation(name: string): void {
    setNameConfirm(name);
    setActionButtonDisabled(name !== channelName);
  }

  async function deleteChannelApproved(): Promise<void> {
    await callAPI('DELETE', 'channels', { id: channelID });
    deleteChannel(channelID);
    emitToSocket(channelSocket, 'deleteChannel', channelID);
    resetSelectedChannel(channelID);
    displayNotification('error', 'Channel deleted');
  }

  async function handleAction(): Promise<void> {
    deleteChannelApproved()
      .then(resetDialog)
      .catch((error) => {
        resetTriggers();
        displayNotification('error', error);
      });
  }

  useEffect(() => {
    if (actionClicked) {
      handleAction();
    }
    if (backClicked) {
      resetDialog();
    }
  }, [actionClicked, backClicked]);

  return (
    <InputField
      label='Confirm Channel Name'
      value={nameConfirm}
      onChange={handleConfirmation}
      onSubmit={handleAction}
    />
  );
}
