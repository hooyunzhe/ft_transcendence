'use client';
import { Stack } from '@mui/material';
import PasswordField from '../utils/PasswordField';
import { useState, useEffect } from 'react';
import callAPI from '@/lib/callAPI';
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
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [newPassConfirm, setNewPassConfirm] = useState('');
  const { changeChannelHash } = useChannelActions();
  const { actionClicked, backClicked } = useDialogTriggers();
  const { resetDialog, resetTriggers } = useDialogActions();
  const { displayNotification } = useNotificationActions();

  async function handlePasswordChange(): Promise<void> {
    if (newPassConfirm !== newPass) {
      throw "Confirmation doesn't match new password";
    }
    if (newPass === oldPass) {
      throw 'Cannot change password to the same password, bro wth.';
    }

    const passChanged = await callAPI('PATCH', 'channels', {
      id: channelID,
      pass: newPass,
      oldPass: oldPass,
    });

    if (passChanged) {
      throw 'Current Password is incorrect';
    }

    const changedChannel = JSON.parse(
      await callAPI(
        'GET',
        `channels?search_type=ONE&search_number=${channelID}`,
      ),
    );

    changeChannelHash(channelID, changedChannel.hash);
  }

  useEffect(() => {
    if (actionClicked) {
      handlePasswordChange()
        .then(() => resetDialog())
        .catch((error) => {
          resetTriggers();
          displayNotification('error', error);
        });
    }
    if (backClicked) {
      resetDialog();
    }
  }, [actionClicked, backClicked]);

  return (
    <Stack spacing={1}>
      <PasswordField
        value={oldPass}
        onChange={(input) => setOldPass(input)}
        label='Current Password'
        variant='standard'
      />
      <PasswordField
        value={newPass}
        onChange={(input) => setNewPass(input)}
        label='New Password'
        variant='standard'
      />
      <PasswordField
        value={newPassConfirm}
        onChange={(input) => setNewPassConfirm(input)}
        label='Confirm New Password'
        variant='standard'
      />
    </Stack>
  );
}
