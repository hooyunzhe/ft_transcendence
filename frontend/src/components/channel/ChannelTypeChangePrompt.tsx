'use client';
import { useEffect, useState } from 'react';
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import PasswordField from '../utils/PasswordField';
import callAPI from '@/lib/callAPI';
import emitToSocket from '@/lib/emitToSocket';
import { useChannelSocket } from '@/lib/stores/useSocketStore';
import { useChannelActions } from '@/lib/stores/useChannelStore';
import {
  useDialogActions,
  useDialogTriggers,
} from '@/lib/stores/useDialogStore';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';
import { ChannelType } from '@/types/ChannelTypes';

interface ChannelTypeChangePromptProps {
  channelID: number;
  channelName: string;
  channelType: ChannelType;
}

export default function ChannelTypeChangePrompt({
  channelID,
  channelName,
  channelType,
}: ChannelTypeChangePromptProps) {
  const channelSocket = useChannelSocket();
  const { changeChannelType, changeChannelHash } = useChannelActions();
  const {
    changeDialog,
    changeActionText,
    setActionButtonDisabled,
    resetDialog,
    resetTriggers,
  } = useDialogActions();
  const { actionClicked, backClicked } = useDialogTriggers();
  const { displayNotification } = useNotificationActions();
  const [displayPasswordPrompt, setDisplayPasswordPrompt] = useState(false);
  const [selectedChannelType, setSelectedChannelType] = useState(channelType);
  const [channelPass, setChannelPass] = useState('');

  async function changeType(): Promise<void> {
    console.log(channelID, selectedChannelType, channelPass);
    await callAPI('PATCH', 'channels', {
      id: channelID,
      type: selectedChannelType,
      ...(channelPass && { pass: channelPass }),
    });
    changeChannelType(channelID, selectedChannelType);
    if (selectedChannelType === ChannelType.PROTECTED) {
      const updatedChannel = JSON.parse(
        await callAPI(
          'GET',
          `channels?search_type=ONE&search_number=${channelID}`,
        ),
      );
      changeChannelHash(channelID, updatedChannel.hash);
    }
    emitToSocket(channelSocket, 'changeChannelType', {
      id: channelID,
      newType: selectedChannelType,
      newPass: channelPass,
    });
    displayNotification('success', 'Channel type changed');
  }

  async function handleTypeChangeAction(): Promise<void> {
    if (selectedChannelType === ChannelType.PROTECTED) {
      setDisplayPasswordPrompt(true);
      changeDialog(
        'Set Password',
        `Create a good and memorable password for ${channelName}`,
        'Create',
        'Back',
        !channelPass,
      );
    } else {
      changeType();
    }
  }

  async function handleAction(): Promise<void> {
    if (displayPasswordPrompt) {
      changeType()
        .then(resetDialog)
        .catch((error) => {
          resetTriggers();
          displayNotification('error', error);
        });
    } else {
      handleTypeChangeAction()
        .then(() =>
          selectedChannelType === ChannelType.PROTECTED
            ? resetTriggers()
            : resetDialog(),
        )
        .catch((error) => {
          resetTriggers();
          displayNotification('error', error);
        });
    }
  }

  useEffect(() => {
    if (actionClicked) {
      handleAction();
    }
    if (backClicked) {
      if (displayPasswordPrompt) {
        setDisplayPasswordPrompt(false);
        changeDialog(
          'Change Channel Type',
          'Choose the channel type you want.',
          'Next',
          'Cancel',
        );
        resetTriggers();
      } else {
        resetDialog();
      }
    }
  }, [actionClicked, backClicked]);

  return displayPasswordPrompt ? (
    <PasswordField
      hasCriteria
      value={channelPass}
      onChange={setChannelPass}
      onSubmit={handleAction}
    />
  ) : (
    <FormControl>
      <RadioGroup
        row
        value={selectedChannelType}
        onChange={(event) => {
          changeActionText(
            event.target.value === ChannelType.PROTECTED ? 'Next' : 'Change',
          );
          setSelectedChannelType(event.target.value as ChannelType);
          setActionButtonDisabled(false);
        }}
      >
        <FormControlLabel
          value={ChannelType.PUBLIC}
          control={<Radio />}
          label='Public'
          disabled={channelType === ChannelType.PUBLIC}
        />
        <FormControlLabel
          value={ChannelType.PROTECTED}
          control={<Radio />}
          label='Protected'
          disabled={channelType === ChannelType.PROTECTED}
        />
        <FormControlLabel
          value={ChannelType.PRIVATE}
          control={<Radio />}
          label='Private'
          disabled={channelType === ChannelType.PRIVATE}
        />
      </RadioGroup>
    </FormControl>
  );
}
