'use client';
import { useState, useEffect } from 'react';
import { Stack } from '@mui/material';
import PasswordField from '../utils/PasswordField';
import callAPI from '@/lib/callAPI';
import checkPasswordCriteria from '@/lib/checkPasswordCriteria';
import { useChannelActions } from '@/lib/stores/useChannelStore';
import {
  useDialogActions,
  useDialogTriggers,
} from '@/lib/stores/useDialogStore';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';

interface ChangePassChangePromptProps {
  channelID: number;
}

export default function ChannelPassChangePrompt({
  channelID,
}: ChangePassChangePromptProps) {
  const { changeChannelHash } = useChannelActions();
  const { setActionButtonDisabled, resetDialog, resetTriggers } =
    useDialogActions();
  const { actionClicked, backClicked } = useDialogTriggers();
  const { displayNotification } = useNotificationActions();
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [newPassConfirm, setNewPassConfirm] = useState('');

  function handleOldPass(pass: string): void {
    setOldPass(pass);
    setActionButtonDisabled(!pass || !newPass || !newPassConfirm);
  }

  function handleNewPass(pass: string): void {
    setNewPass(pass);
    setActionButtonDisabled(
      !oldPass || !pass || !newPassConfirm || pass !== newPassConfirm,
    );
  }
  function handleNewPassConfirm(pass: string): void {
    setNewPassConfirm(pass);
    setActionButtonDisabled(!oldPass || !newPass || !pass || newPass !== pass);
  }

  async function handlePasswordChange(): Promise<void> {
    if (newPass === oldPass) {
      throw 'Cannot change password to the same password, bro wth.';
    }

    const channelResponse = await callAPI('PATCH', 'channels', {
      id: channelID,
      pass: newPass,
      oldPass: oldPass,
      hash: '',
    });

    if (channelResponse.status === 200) {
      const changedChannel = await callAPI(
        'GET',
        `channels?search_type=ONE&search_number=${channelID}`,
      ).then((res) => res.body);

      if (changedChannel) {
        changeChannelHash(channelID, changedChannel.hash);
        displayNotification('success', 'Channel password changed');
      } else {
        throw 'FATAL ERROR: FAILED TO GET CHANGED CHANNEL IN BACKEND';
      }
    } else if (channelResponse.status === 403) {
      throw 'Current Password is incorrect';
    } else {
      throw 'FATAL ERROR: FAILED TO CHANGE CHANNEL PASSWORD IN BACKEND';
    }
  }

  async function handleAction(): Promise<void> {
    handlePasswordChange()
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
    <Stack spacing={1}>
      <PasswordField
        label='Current Password'
        value={oldPass}
        onChange={handleOldPass}
        onSubmit={handleAction}
      />
      <PasswordField
        unfocused
        hasCriteria
        label='New Password'
        value={newPass}
        onChange={handleNewPass}
        onSubmit={handleAction}
      />
      <PasswordField
        unfocused
        disabled={checkPasswordCriteria(newPass).length > 0}
        label='Confirm New Password'
        value={newPassConfirm}
        onChange={handleNewPassConfirm}
        onSubmit={handleAction}
      />
    </Stack>
  );
}
