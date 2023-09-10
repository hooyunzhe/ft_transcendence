'use client';
import { useEffect, useState } from 'react';
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import PasswordField from '../utils/PasswordField';
import InputField from '../utils/InputField';
import callAPI from '@/lib/callAPI';
import emitToSocket from '@/lib/emitToSocket';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import { useChannelSocket } from '@/lib/stores/useSocketStore';
import {
  useChannelActions,
  useChannelChecks,
} from '@/lib/stores/useChannelStore';
import { useChannelMemberActions } from '@/lib/stores/useChannelMemberStore';
import {
  useDialogActions,
  useDialogTriggers,
} from '@/lib/stores/useDialogStore';
import { useAchievementActions } from '@/lib/stores/useAchievementStore';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';
import { useUtilActions } from '@/lib/stores/useUtilStore';
import { Channel, ChannelType } from '@/types/ChannelTypes';
import { ChannelMemberRole } from '@/types/ChannelMemberTypes';
import { View } from '@/types/UtilTypes';

export default function ChannelCreatePrompt() {
  const currentUser = useCurrentUser();
  const channelSocket = useChannelSocket();
  const { addChannel, addJoinedChannel, setSelectedChannel } =
    useChannelActions();
  const { checkChannelExists, checkChannelJoined } = useChannelChecks();
  const { addChannelMember } = useChannelMemberActions();
  const { actionClicked, backClicked } = useDialogTriggers();
  const { changeDialog, changeActionText, resetDialog, resetTriggers } =
    useDialogActions();
  const { handleAchievementsEarned } = useAchievementActions();
  const { displayNotification } = useNotificationActions();
  const { setCurrentView } = useUtilActions();
  const [displayPasswordPrompt, setDisplayPasswordPrompt] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [channelType, setChannelType] = useState(ChannelType.PUBLIC);
  const [channelPass, setChannelPass] = useState('');

  async function createChannel(): Promise<void> {
    const newChannel: Channel = await callAPI('POST', 'channels', {
      name: channelName.trim(),
      type: channelType,
      pass: channelPass,
    }).then((res) => res.body);

    if (newChannel) {
      addChannel(newChannel);
      emitToSocket(channelSocket, 'newChannel', newChannel);

      const channelCreator = await callAPI('POST', 'channel-members', {
        channel_id: newChannel.id,
        user_id: currentUser.id,
        role: ChannelMemberRole.OWNER,
        pass: channelPass,
      }).then((res) => res.body);

      if (channelCreator) {
        addJoinedChannel(newChannel.id);
        addChannelMember(channelCreator);
        emitToSocket(channelSocket, 'joinRoom', newChannel.id);
        emitToSocket(channelSocket, 'newMember', channelCreator);
        await handleAchievementsEarned(
          currentUser.id,
          6,
          displayNotification,
        ).then(
          (earned) =>
            earned && displayNotification('success', 'Channel created'),
        );
        setSelectedChannel(newChannel);
        setCurrentView(View.CHAT);
      } else {
        throw 'FATAL ERROR: FAILED TO ADD MEMBER TO NEW CHANNEL IN BACKEND';
      }
    } else {
      throw 'FATAL ERROR: FAILED TO CREATE NEW CHANNEL IN BACKEND';
    }
  }

  async function handleCreateChannelAction(): Promise<void> {
    if (checkChannelExists(channelName.trim())) {
      throw 'Channel already exists';
    }
    if (channelName.length > 16) {
      throw 'Channel names cannot be longer than 16 characters.';
    }
    if (channelName.trim().length === 0) {
      throw 'Cannot change name into just spaces.';
    }
    if (checkChannelJoined(channelName.trim())) {
      throw 'Already in channel';
    }
    if (channelType === ChannelType.PROTECTED) {
      setDisplayPasswordPrompt(true);
      changeDialog(
        'Set Password',
        `Create a good and memorable password for ${channelName}`,
        'Create',
        'Back',
        !channelPass,
      );
    } else {
      createChannel();
    }
  }

  async function handleAction(): Promise<void> {
    if (displayPasswordPrompt) {
      createChannel()
        .then(resetDialog)
        .catch((error) => {
          resetTriggers();
          displayNotification('error', error);
        });
    } else {
      handleCreateChannelAction()
        .then(() =>
          channelType === ChannelType.PROTECTED
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
          'Create Channel',
          'Choose a name and type to get started',
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
    <FormControl fullWidth>
      <InputField
        label='Channel Name'
        value={channelName}
        onChange={setChannelName}
        onSubmit={handleAction}
      />
      <RadioGroup
        row
        value={channelType}
        onChange={(event) => {
          changeActionText(
            event.target.value === ChannelType.PROTECTED ? 'Next' : 'Create',
          );
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
