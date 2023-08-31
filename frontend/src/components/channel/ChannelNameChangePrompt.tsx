'use client';
import { useEffect, useState } from 'react';
import InputField from '../utils/InputField';
import callAPI from '@/lib/callAPI';
import emitToSocket from '@/lib/emitToSocket';
import { useChannelSocket } from '@/lib/stores/useSocketStore';
import {
  useChannelActions,
  useChannelChecks,
} from '@/lib/stores/useChannelStore';
import {
  useDialogActions,
  useDialogTriggers,
} from '@/lib/stores/useDialogStore';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';

interface ChannelNameChangePromptProps {
  channelID: number;
  channelName: string;
}

export default function ChannelNameChangePrompt({
  channelID,
  channelName,
}: ChannelNameChangePromptProps) {
  const channelSocket = useChannelSocket();
  const { changeChannelName } = useChannelActions();
  const { resetDialog } = useDialogActions();
  const { actionClicked, backClicked } = useDialogTriggers();
  const { displayNotification } = useNotificationActions();
  const [newName, setNewName] = useState('');
  const { checkChannelExists } = useChannelChecks();

  async function handleNameChange() {
    if (newName === channelName) {
      throw 'New name cannot be the same name. That is dumb.';
    }
    if (newName.length > 16) {
      throw 'Channel names cannot be longer than 16 characters.';
    }
    if (newName.trim().length === 0) {
      throw 'Cannot change name into just spaces.';
    }
    if (checkChannelExists(newName)) {
      throw 'Channel name already taken.';
    }
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
    handleNameChange()
      .then(resetDialog)
      .catch((error) => {
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
      label='Channel Name'
      value={newName}
      onChange={setNewName}
      onSubmit={handleAction}
    />
  );
}
