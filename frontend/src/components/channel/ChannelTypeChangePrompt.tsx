'use client';
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import DialogPrompt from '../utils/LegacyDialogPrompt';
import { useState } from 'react';
import { ChannelType } from '@/types/ChannelTypes';
import { useChannelActions } from '@/lib/stores/useChannelStore';
import callAPI from '@/lib/callAPI';
import { useChannelSocket } from '@/lib/stores/useSocketStore';
import emitToSocket from '@/lib/emitToSocket';

interface ChannelTypeChangeProps {
  channelID: number;
  channelType: ChannelType;
}

export default function ChannelTypeChangePrompt({
  channelID,
  channelType,
}: ChannelTypeChangeProps) {
  const { changeChannelType, changeChannelHash } = useChannelActions();
  const [input, setInput] = useState('');
  const [selectedChannelType, setSelectedChannelType] = useState(channelType);
  const channelSocket = useChannelSocket();

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
  }

  return (
    <DialogPrompt
      disableText={selectedChannelType !== ChannelType.PROTECTED}
      buttonText='Change Channel Type'
      dialogTitle='Change Channel Type'
      dialogDescription='Please provide type you want to change to.'
      labelText='Channel Password'
      textInput={selectedChannelType === ChannelType.PROTECTED ? input : ''}
      backButtonText='Cancel'
      onChangeHandler={(input) => {
        setInput(input);
      }}
      backHandler={async () => {}}
      actionButtonText='Change'
      handleAction={async () => {
        console.log(input);
        changeType(channelID, selectedChannelType, input);
        return '';
      }}
    >
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
    </DialogPrompt>
  );
}
