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
  const [removeConfirm, setRemoveConfirm] = useState('');
  const { actionClicked, backClicked } = useDialogTriggers();
  const { setActionButtonDisabled, resetTriggers, resetDialog } =
    useDialogActions();
  const { displayNotification } = useNotificationActions();

  function handleConfirmation(removeConfirm: string): void {
    setRemoveConfirm(removeConfirm);
    setActionButtonDisabled(
      removeConfirm !== 'Remove two-factor authentication for me',
    );
  }

  async function handleTwoFactorRemoval(): Promise<void> {
    callAPI('DELETE', 'two-factor', {
      user_id: currentUser.id,
    });
    setCurrentUserTwoFactorEnabled(false);
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
      value={removeConfirm}
      onChange={handleConfirmation}
      onSubmit={handleAction}
    />
  );
}
