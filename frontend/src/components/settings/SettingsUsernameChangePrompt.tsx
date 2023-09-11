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
    if (newUsername.trim() === currentUser.username) {
      throw 'New name cannot be the same name, that is dumb.';
    }
    if (newUsername.trim().length === 0) {
      throw 'Cannot change name into just spaces.';
    }
    if (newUsername.length > 16) {
      throw 'Username cannot be more than 16 characters long';
    }
    if (/[^ a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newUsername)) {
      throw 'Username can only contain alphanumeric and common symbols';
    }
    const userRes = await callAPI('PATCH', 'users', {
      id: currentUser.id,
      username: newUsername.trim(),
    });

    if (userRes.status === 200) {
      changeCurrentUsername(newUsername.trim());
      displayNotification('success', 'Username changed, refreshing...');
      location.reload();
    } else if (userRes.status === 400) {
      throw 'Username already taken';
    } else {
      throw 'FATAL ERROR: FAILED TO CHANGE USERNAME IN BACKEND';
    }
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
