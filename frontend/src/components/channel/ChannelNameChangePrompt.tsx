'use client';
import { useChannelActions } from '@/lib/stores/useChannelStore';
import DialogPrompt from '../utils/DialogPrompt';
import { useState } from 'react';
import callAPI from '@/lib/callAPI';

interface ChannelNameChangeProps {
  channelID: number;
}

export default function ChannelNameChangePrompt({
  channelID,
}: ChannelNameChangeProps) {
  const { changeChannelName } = useChannelActions();
  const [input, setInput] = useState('');

  async function changeName(channelID: number, newName: string) {
    await callAPI('PATCH', 'channels', {
      id: channelID,
      name: newName,
    });
    changeChannelName(channelID, newName);
    // channelMemberSocket.emit('changeChannelName', newChannel);
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
