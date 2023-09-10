'use client';
import { signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import InputField from '../utils/InputField';
import callAPI from '@/lib/callAPI';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import { useUserSocket } from '@/lib/stores/useSocketStore';
import {
  useDialogActions,
  useDialogTriggers,
} from '@/lib/stores/useDialogStore';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';

export default function SettingsAccountDeletePrompt() {
  const currentUser = useCurrentUser();
  const userSocket = useUserSocket();
  const [confirmPhrase, setConfirmPhrase] = useState('');
  const { actionClicked, backClicked } = useDialogTriggers();
  const { setActionButtonDisabled, resetTriggers, resetDialog } =
    useDialogActions();
  const { displayNotification } = useNotificationActions();

  function handleConfirmation(phrase: string): void {
    setConfirmPhrase(phrase);
    setActionButtonDisabled(phrase !== 'Delete my account for me');
  }

  async function handleAccountDeletion(): Promise<void> {
    await callAPI('DELETE', 'users', {
      id: currentUser.id,
    });
    userSocket?.emit('deleteAccount');
    displayNotification('error', 'Account deleted, goodbye...');
  }

  async function handleAction(): Promise<void> {
    handleAccountDeletion()
      .then(() => signOut())
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
      label='Confirm Deletion Phrase'
      value={confirmPhrase}
      onChange={handleConfirmation}
      onSubmit={handleAction}
    />
  );
}
