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
  channelHash: string;
}

export default function ChannelTypeChangePrompt({
  channelID,
  channelName,
  channelType,
  channelHash,
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
    const channelResponse = await callAPI('PATCH', 'channels', {
      id: channelID,
      type: selectedChannelType,
      hash: channelHash ?? '',
      ...(channelPass && { pass: channelPass }),
    });

    if (channelResponse.status === 200) {
      changeChannelType(channelID, selectedChannelType);
      if (selectedChannelType === ChannelType.PROTECTED) {
        const updatedChannel = await callAPI(
          'GET',
          `channels?search_type=ONE&search_number=${channelID}`,
        ).then((res) => res.body);

        if (updatedChannel) {
          changeChannelHash(channelID, updatedChannel.hash);
          emitToSocket(channelSocket, 'changeChannelType', {
            id: channelID,
            newType: selectedChannelType,
            newHash: updatedChannel.hash,
          });
        } else {
          throw 'FATAL ERROR: FAILED TO GET UPDATED CHANNEL IN BACKEND';
        }
      } else {
        emitToSocket(channelSocket, 'changeChannelType', {
          id: channelID,
          newType: selectedChannelType,
        });
      }
      displayNotification(
        'success',
        `Channel type changed to ${selectedChannelType.toLowerCase()}`,
      );
    } else if (channelResponse.status === 403) {
      throw "FATAL ERROR: CHANNEL HASH DOESN'T MATCH IN BACKEND";
    } else {
      throw 'FATAL ERROR: FAILED TO CHANGE CHANNEL TYPE IN BACKEND';
    }
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
      changeType().catch((error) => {
        resetTriggers();
        displayNotification('error', error);
      });
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
      handleTypeChangeAction().then(() =>
        selectedChannelType === ChannelType.PROTECTED
          ? resetTriggers()
          : resetDialog(),
      );
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
