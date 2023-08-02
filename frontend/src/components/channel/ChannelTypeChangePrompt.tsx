'use client';
import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import DialogPrompt from '../utils/LegacyDialogPrompt';
import { useState } from 'react';
import { ChannelType } from '@/types/ChannelTypes';
import { useChannelActions } from '@/lib/stores/useChannelStore';
import callAPI from '@/lib/callAPI';
import { useChannelSocket } from '@/lib/stores/useSocketStore';
import emitToSocket from '@/lib/emitToSocket';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';
import { useDialogActions } from '@/lib/stores/useDialogStore';

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
  const [input, setInput] = useState('');
  const [selectedChannelType, setSelectedChannelType] = useState(channelType);
  const { setDialogPrompt, resetDialog } = useDialogActions();

  async function changeType(
    channelID: number,
    newType: ChannelType,
    newPass?: string,
  ) {
    const data = {
      id: channelID,
      type: newType,
      pass: newPass,
    };
    await callAPI('PATCH', 'channels', data);
    changeChannelType(channelID, newType);
    if (newType === ChannelType.PROTECTED) {
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
  }

  return (
    <Button
      onClick={() =>
        setDialogPrompt(
          true,
          'Change Channel Type',
          'Assign channel type you want to change to.',
          'Cancel',
          resetDialog,
          'Change',
          async () => {
            changeType(channelID, selectedChannelType, input);
            setInput('');
          },
          <>
            <FormControl>
              <RadioGroup
                row
                defaultValue={channelType}
                onChange={(event) => {
                  setSelectedChannelType(event.target.value as ChannelType);
                }}
              >
                <FormControlLabel
                  value={ChannelType.PUBLIC}
                  control={<Radio />}
                  label='Public'
                />
                <FormControlLabel
                  value={ChannelType.PROTECTED}
                  control={<Radio />}
                  label='Protected'
                />
                <FormControlLabel
                  value={ChannelType.PRIVATE}
                  control={<Radio />}
                  label='Private'
                />
              </RadioGroup>
            </FormControl>
            <TextField
              disabled={selectedChannelType !== ChannelType.PROTECTED}
              onChange={(event) => {
                setInput(event.target.value);
              }}
              id='standard-basic'
              label='Standard'
              variant='standard'
            />
          </>,
        )
      }
    >
      Change Channel Type
    </Button>
  );
}
