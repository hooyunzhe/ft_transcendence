'use client';
import { useEffect, useState } from 'react';
import InputField from '../utils/InputField';
import callAPI from '@/lib/callAPI';
import { useCurrentUser, useUserActions } from '@/lib/stores/useUserStore';
import {
  useDialogActions,
  useDialogTriggers,
} from '@/lib/stores/useDialogStore';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';

export default function SettingsUsernameChangePrompt() {
  const currentUser = useCurrentUser();
  const { changeCurrentUsername } = useUserActions();
  const { resetDialog, resetTriggers } = useDialogActions();
  const { actionClicked, backClicked } = useDialogTriggers();
  const { displayNotification } = useNotificationActions();
  const [newUsername, setNewUsername] = useState('');

  async function handleUsernameChange(): Promise<void> {
    if (newUsername.trim().length === 0) {
      throw 'Cannot change name into just spaces.';
    }
    if (newUsername.length > 16) {
      throw 'Username cannot be more than 16 characters long';
    }
    if (/[^ a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newUsername)) {
      throw 'Username can only contain alphanumeric and common symbols';
    }
    await callAPI('PATCH', 'users', {
      id: currentUser.id,
      username: newUsername.trim(),
    });
    changeCurrentUsername(newUsername.trim());
    displayNotification('success', 'Username changed, refreshing...');
    location.reload();
  }

  async function handleAction(): Promise<void> {
    handleUsernameChange()
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
      label='Username'
      value={newUsername}
      onChange={setNewUsername}
      onSubmit={handleAction}
    />
  );
}
