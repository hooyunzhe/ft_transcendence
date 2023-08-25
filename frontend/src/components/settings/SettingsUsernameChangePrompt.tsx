'use client';
import { useEffect, useState } from 'react';
import InputField from '../utils/InputField';
import callAPI from '@/lib/callAPI';
import { useUserActions } from '@/lib/stores/useUserStore';
import {
  useDialogActions,
  useDialogTriggers,
} from '@/lib/stores/useDialogStore';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';

interface SettingsUsernameChangePromptProps {
  currentUserID: number;
}

export default function SettingsUsernameChangePrompt({
  currentUserID,
}: SettingsUsernameChangePromptProps) {
  const { changeCurrentUsername } = useUserActions();
  const { resetDialog } = useDialogActions();
  const { actionClicked, backClicked } = useDialogTriggers();
  const { displayNotification } = useNotificationActions();
  const [newUsername, setNewUsername] = useState('');

  async function handleUsernameChange(): Promise<void> {
    await callAPI('PATCH', 'users', {
      id: currentUserID,
      username: newUsername,
    });
    changeCurrentUsername(newUsername);
    displayNotification('success', 'Username changed');
    location.reload();
  }

  async function handleAction(): Promise<void> {
    handleUsernameChange().then(resetDialog);
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
      label='Username'
      value={newUsername}
      onChange={setNewUsername}
      onSubmit={handleAction}
    />
  );
}
