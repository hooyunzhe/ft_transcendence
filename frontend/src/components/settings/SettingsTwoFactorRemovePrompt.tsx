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

export default function SettingsTwoFactorRemovePrompt() {
  const currentUser = useCurrentUser();
  const { setCurrentUserTwoFactorEnabled } = useUserActions();
  const [confirmPhrase, setConfirmPhrase] = useState('');
  const { actionClicked, backClicked } = useDialogTriggers();
  const { setActionButtonDisabled, resetTriggers, resetDialog } =
    useDialogActions();
  const { displayNotification } = useNotificationActions();

  function handleConfirmation(phrase: string): void {
    setConfirmPhrase(phrase);
    setActionButtonDisabled(
      phrase !== 'Remove two-factor authentication for me',
    );
  }

  async function handleTwoFactorRemoval(): Promise<void> {
    await callAPI('DELETE', 'two-factor', {
      user_id: currentUser.id,
    });
    setCurrentUserTwoFactorEnabled(false);
    displayNotification('error', 'Two-factor authentication removed!');
  }

  async function handleAction(): Promise<void> {
    handleTwoFactorRemoval()
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
      label='Confirm Removal Phrase'
      value={confirmPhrase}
      onChange={handleConfirmation}
      onSubmit={handleAction}
    />
  );
}
