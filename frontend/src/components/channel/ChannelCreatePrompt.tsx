'use client';
import { useEffect, useState } from 'react';
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { Channel, ChannelType } from '@/types/ChannelTypes';
import callAPI from '@/lib/callAPI';
import { ChannelMemberRole } from '@/types/ChannelMemberTypes';
import {
  useChannelActions,
  useChannelChecks,
} from '@/lib/stores/useChannelStore';
import { useChannelMemberActions } from '@/lib/stores/useChannelMemberStore';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';
import emitToSocket from '@/lib/emitToSocket';
import { useChannelSocket } from '@/lib/stores/useSocketStore';
import {
  useDialogActions,
  useDialogTriggers,
} from '@/lib/stores/useDialogStore';
import PasswordField from '../utils/PasswordField';

export default function ChannelCreatePrompt() {
  const currentUser = useCurrentUser();
  const { addChannel, addJoinedChannel } = useChannelActions();
  const { checkChannelExists, checkChannelJoined } = useChannelChecks();
  const { addChannelMember } = useChannelMemberActions();
  const { displayNotification } = useNotificationActions();
  const channelSocket = useChannelSocket();
  const [channelName, setChannelName] = useState('');
  const [channelType, setChannelType] = useState<ChannelType>(
    ChannelType.PUBLIC,
  );
  const [channelPass, setChannelPass] = useState('');
  const [displayPasswordPrompt, setDisplayPasswordPrompt] = useState(false);
  const { actionClicked, backClicked } = useDialogTriggers();
  const { resetDialog, resetTriggers } = useDialogActions();

  function resetState() {
    setChannelName('');
    setChannelType(ChannelType.PUBLIC);
    setChannelPass('');
  }

  async function createChannel(): Promise<void> {
    const newChannel: Channel = JSON.parse(
      await callAPI('POST', 'channels', {
        name: channelName.trim(),
        type: channelType,
        pass: channelPass,
      }),
    );

    if (newChannel) {
      addChannel(newChannel);
      emitToSocket(channelSocket, 'newChannel', newChannel);

      const channelCreator = JSON.parse(
        await callAPI('POST', 'channel-members', {
          channel_id: newChannel.id,
          user_id: currentUser.id,
          role: ChannelMemberRole.OWNER,
          pass: channelPass,
        }),
      );

      if (channelCreator) {
        addJoinedChannel(newChannel.id);
        addChannelMember(channelCreator);
        emitToSocket(channelSocket, 'joinRoom', newChannel.id);
        displayNotification('success', 'Channel created');
      } else {
        throw 'FATAL ERROR: FAILED TO ADD MEMBER TO NEW CHANNEL IN BACKEND';
      }
    } else {
      throw 'FATAL ERROR: FAILED TO CREATE NEW CHANNEL IN BACKEND';
    }
  }

  async function handleCreateChannelAction(): Promise<void> {
    if (!channelName) {
      throw 'Channel name cannot be empty';
    }
    if (checkChannelExists(channelName.trim())) {
      throw 'Channel already exists';
    }
    if (checkChannelJoined(channelName.trim())) {
      throw 'Already in channel';
    }
    if (channelType === ChannelType.PROTECTED) {
      setDisplayPasswordPrompt(true);
    } else {
      createChannel();
      resetState();
    }
  }

  useEffect(() => {
    if (actionClicked) {
      if (displayPasswordPrompt) {
        createChannel()
          .then(() => resetDialog())
          .catch((error) => {
            resetTriggers();
            displayNotification('error', error);
          });
      } else {
        handleCreateChannelAction()
          .then(() => {
            if (channelType === ChannelType.PROTECTED) {
              resetTriggers();
            } else {
              resetDialog();
            }
          })
          .catch((error) => {
            resetTriggers();
            displayNotification('error', error);
          });
      }
    }
    if (backClicked) {
      if (displayPasswordPrompt) {
        setDisplayPasswordPrompt(false);
        resetTriggers();
      } else {
        resetDialog();
      }
    }
  }, [actionClicked, backClicked]);

  return displayPasswordPrompt ? (
    <PasswordField
      value={channelPass}
      onChange={(input) => setChannelPass(input)}
      variant='standard'
    />
  ) : (
    <FormControl fullWidth>
      <TextField
        fullWidth
        autoComplete='off'
        variant='standard'
        margin='dense'
        label='Channel Name'
        value={channelName}
        onChange={(event) => setChannelName(event.target.value)}
      />
      <RadioGroup
        row
        value={channelType}
        onChange={(event) => {
          setChannelType(event.target.value as ChannelType);
        }}
      >
        <FormControlLabel
          value={ChannelType.PUBLIC}
          control={<Radio />}
          label='Public'
        />
        <FormControlLabel
          value={ChannelType.PRIVATE}
          control={<Radio />}
          label='Private'
        />
        <FormControlLabel
          value={ChannelType.PROTECTED}
          control={<Radio />}
          label='Protected'
        />
      </RadioGroup>
    </FormControl>
  );
}
