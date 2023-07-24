'use client';
import { useChannelActions } from '@/lib/stores/useChannelStore';
import DialogPrompt from '../utils/DialogPrompt';
import { useState } from 'react';
import callAPI from '@/lib/callAPI';
import emitToSocket from '@/lib/emitToSocket';
import { useChannelSocket } from '@/lib/stores/useSocketStore';

interface ChannelNameChangeProps {
  channelID: number;
}

export default function ChannelNameChangePrompt({
  channelID,
}: ChannelNameChangeProps) {
  const { changeChannelName } = useChannelActions();
  const [input, setInput] = useState('');
  const channelSocket = useChannelSocket();

  async function changeName(channelID: number, newName: string) {
    const data = {
      id: channelID,
      newName: newName,
    };
    await callAPI('PATCH', 'channels', data);
    changeChannelName(channelID, newName);
    emitToSocket(channelSocket, 'changeChannelName', data);
  }

  return (
    <DialogPrompt
      buttonText='Change channel Name'
      dialogTitle='Change Channel Name'
      dialogDescription='Please provide name you want to change to.'
      labelText='channel name'
      textInput={input}
      backButtonText='Cancel'
      onChangeHandler={(input) => {
        setInput(input);
      }}
      backHandler={async () => {}}
      actionButtonText='Change'
      handleAction={async () => {
        changeName(channelID, input);
        setInput('');
        return '';
      }}
    ></DialogPrompt>
  );
}
