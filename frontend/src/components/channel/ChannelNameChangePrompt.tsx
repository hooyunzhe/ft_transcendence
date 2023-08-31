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
  channelHash: string;
}

export default function ChannelNameChangePrompt({
  channelID,
  channelName,
  channelHash,
}: ChannelNameChangePromptProps) {
  const channelSocket = useChannelSocket();
  const { changeChannelName } = useChannelActions();
  const { resetDialog, resetTriggers } = useDialogActions();
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
    const channelResponse = await callAPI('PATCH', 'channels', {
      id: channelID,
      name: newName.trim(),
      hash: channelHash ?? '',
    });

    if (channelResponse.status === 200) {
      changeChannelName(channelID, newName);
      emitToSocket(channelSocket, 'changeChannelName', {
        id: channelID,
        newName: newName,
      });
      displayNotification('success', `Channel name changed to ${newName}`);
    } else if (channelResponse.status === 403) {
      throw "FATAL ERROR: CHANNEL HASH DOESN'T MATCH IN BACKEND";
    } else {
      throw 'FATAL ERROR: FAILED TO CHANGE CHANNEL NAME IN BACKEND';
    }
  }

  async function handleAction(): Promise<void> {
    handleNameChange()
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
      label='Channel Name'
      value={newName}
      onChange={setNewName}
      onSubmit={handleAction}
    />
  );
}
