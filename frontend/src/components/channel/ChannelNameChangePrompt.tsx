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

interface ChannelNameChangePromptProps {
  channelID: number;
}

export default function ChannelNameChangePrompt({
  channelID,
}: ChannelNameChangePromptProps) {
  const channelSocket = useChannelSocket();
  const { changeChannelName } = useChannelActions();
  const { resetDialog } = useDialogActions();
  const { actionClicked, backClicked } = useDialogTriggers();
  const { displayNotification } = useNotificationActions();
  const [newName, setNewName] = useState('');

  async function handleNameChange(): Promise<void> {
    await callAPI('PATCH', 'channels', {
      id: channelID,
      name: newName,
    });
    changeChannelName(channelID, newName);
    emitToSocket(channelSocket, 'changeChannelName', {
      id: channelID,
      newName: newName,
    });
    displayNotification('success', 'Channel name changed');
  }

  async function handleAction(): Promise<void> {
    handleNameChange().then(resetDialog);
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
      label='Channel Name'
      value={newName}
      onChange={setNewName}
      onSubmit={handleAction}
    />
  );
}
