'use client';
import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import ChannelDisplay from './ChannelDisplay';
import PasswordField from '../utils/PasswordField';
import callAPI from '@/lib/callAPI';
import emitToSocket from '@/lib/emitToSocket';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import { useChannelSocket } from '@/lib/stores/useSocketStore';
import { useChannelActions } from '@/lib/stores/useChannelStore';
import { useChannelMemberActions } from '@/lib/stores/useChannelMemberStore';
import {
  useDialogActions,
  useDialogTriggers,
} from '@/lib/stores/useDialogStore';
import { useAchievementActions } from '@/lib/stores/useAchievementStore';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';
import { useUtilActions } from '@/lib/stores/useUtilStore';
import { Channel, ChannelType } from '@/types/ChannelTypes';
import { ChannelMember, ChannelMemberRole } from '@/types/ChannelMemberTypes';
import { View } from '@/types/UtilTypes';

interface ChannelJoinPromptProps {
  joinableChannels: Channel[];
}

export default function ChannelJoinPrompt({
  joinableChannels,
}: ChannelJoinPromptProps) {
  const currentUser = useCurrentUser();
  const channelSocket = useChannelSocket();
  const { addJoinedChannel, setSelectedChannel } = useChannelActions();
  const { addChannelMember, deleteChannelMembers } = useChannelMemberActions();
  const {
    changeDialog,
    changeActionText,
    setActionButtonDisabled,
    resetDialog,
    resetTriggers,
  } = useDialogActions();
  const { actionClicked, backClicked } = useDialogTriggers();
  const { handleAchievementsEarned } = useAchievementActions();
  const { displayNotification } = useNotificationActions();
  const { setCurrentView } = useUtilActions();
  const [displayPasswordPrompt, setDisplayPasswordPrompt] = useState(false);
  const [selectedChannelToJoin, setSelectedChannelToJoin] = useState<
    Channel | undefined
  >();
  const [channelPass, setChannelPass] = useState('');

  async function joinChannel(): Promise<void> {
    if (selectedChannelToJoin) {
      const channelMemberResponse = await callAPI('POST', 'channel-members', {
        channel_id: selectedChannelToJoin.id,
        user_id: currentUser.id,
        role: ChannelMemberRole.MEMBER,
        pass: channelPass,
      });

      if (channelMemberResponse.status === 201) {
        const joiningChannelMember = channelMemberResponse.body;
        const existingChannelMembers = await callAPI(
          'GET',
          `channel-members?search_type=CHANNEL&search_number=${selectedChannelToJoin.id}`,
        ).then((res) => res.body);

        if (existingChannelMembers) {
          addJoinedChannel(selectedChannelToJoin.id);
          deleteChannelMembers(selectedChannelToJoin.id);
          existingChannelMembers.forEach((member: ChannelMember) =>
            addChannelMember(member),
          );
          emitToSocket(channelSocket, 'joinRoom', selectedChannelToJoin.id);
          emitToSocket(channelSocket, 'newMember', {
            newMember: joiningChannelMember,
            adminMember: joiningChannelMember,
          });
          await handleAchievementsEarned(
            currentUser.id,
            7,
            displayNotification,
          );
          displayNotification('success', 'Channel joined');
          setSelectedChannel(selectedChannelToJoin);
          setCurrentView(View.CHAT);
        } else {
          throw 'FATAL ERROR: FAILED TO GET CHANNEL MEMBERS IN BACKEND';
        }
      } else if (channelMemberResponse.status === 403) {
        throw 'Incorrect password';
      } else {
        throw 'FATAL ERROR: FAILED TO JOIN CHANNEL IN BACKEND';
      }
    } else {
      throw 'FATAL ERROR: FAILED TO JOIN DUE TO MISSING SELECTED CHANNEL TO JOIN';
    }
  }

  async function handleJoinChannelAction(): Promise<void> {
    if (selectedChannelToJoin?.type === ChannelType.PROTECTED) {
      setDisplayPasswordPrompt(true);
      changeDialog(
        'Enter Password',
        `Enter password in order to join ${selectedChannelToJoin.name}`,
        'Join',
        'Back',
        !channelPass,
      );
    } else {
      joinChannel();
    }
  }

  async function handleAction(): Promise<void> {
    if (displayPasswordPrompt) {
      joinChannel()
        .then(resetDialog)
        .catch((error) => {
          resetTriggers();
          displayNotification('error', error);
        });
    } else {
      handleJoinChannelAction()
        .then(() =>
          selectedChannelToJoin?.type === ChannelType.PROTECTED
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
          'Join Channel',
          'Find and join a channel to start chatting',
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
      value={channelPass}
      onChange={setChannelPass}
      onSubmit={handleAction}
    />
  ) : (
    <Stack
      maxHeight={200}
      spacing={1}
      sx={{
        p: 1,
        overflow: 'auto',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {joinableChannels.map((channel: Channel, index: number) => (
        <ChannelDisplay
          key={index}
          channelID={channel.id}
          channelName={channel.name}
          channelType={channel.type}
          channelHash={channel.hash}
          isOwner={false}
          currentChannelMember={undefined}
          selected={selectedChannelToJoin?.id === channel.id ?? false}
          selectCurrent={() => {
            changeActionText(
              channel.type === ChannelType.PROTECTED ? 'Next' : 'Join',
            );
            setSelectedChannelToJoin(
              channel.id === selectedChannelToJoin?.id ? undefined : channel,
            );
            setActionButtonDisabled(channel.id === selectedChannelToJoin?.id);
          }}
        />
      ))}
    </Stack>
  );
}
