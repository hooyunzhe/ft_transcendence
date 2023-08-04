'use client';
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { ChannelType } from '@/types/ChannelTypes';
import { useChannelActions } from '@/lib/stores/useChannelStore';
import callAPI from '@/lib/callAPI';
import { useChannelSocket } from '@/lib/stores/useSocketStore';
import emitToSocket from '@/lib/emitToSocket';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';
import {
  useDialogActions,
  useDialogTriggers,
} from '@/lib/stores/useDialogStore';
import PasswordField from '../utils/PasswordField';

interface ChannelTypeChangeProps {
  channelID: number;
  channelType: ChannelType;
}

export default function ChannelTypeChangePrompt({
  channelID,
  channelType,
}: ChannelTypeChangeProps) {
  const { changeChannelType, changeChannelHash } = useChannelActions();
  const { displayNotification } = useNotificationActions();
  const channelSocket = useChannelSocket();
  const [channelPass, setChannelPass] = useState('');
  const [selectedChannelType, setSelectedChannelType] = useState<
    ChannelType | undefined
  >();
  const { resetDialog, resetTriggers } = useDialogActions();
  const { actionClicked, backClicked } = useDialogTriggers();

  async function handleTypeChange() {
    if (selectedChannelType) {
      const data = {
        id: channelID,
        type: selectedChannelType,
        pass: channelPass,
      };
      await callAPI('PATCH', 'channels', data);
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
      emitToSocket(channelSocket, 'changeChannelType', data);
      displayNotification('success', 'Channel type changed');
    } else {
      throw 'No channel type was selected';
    }
  }

  useEffect(() => {
    if (actionClicked) {
      handleTypeChange()
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
    <>
      <FormControl>
        <RadioGroup
          row
          onChange={(event) => {
            setSelectedChannelType(event.target.value as ChannelType);
            if (event.target.value !== ChannelType.PROTECTED) {
              setChannelPass('');
            }
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
      <PasswordField
        value={channelPass}
        onChange={setChannelPass}
        label='Password'
        variant='standard'
        disabled={selectedChannelType !== ChannelType.PROTECTED}
      />
    </>
  );
}
