'use client';
import { useEffect, useState } from 'react';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import callAPI from '@/lib/callAPI';
import emitToSocket from '@/lib/emitToSocket';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import { useChannelSocket } from '@/lib/stores/useSocketStore';
import {
  useChannelMemberActions,
  useChannelMemberChecks,
} from '@/lib/stores/useChannelMemberStore';
import {
  useDialogActions,
  useDialogTriggers,
} from '@/lib/stores/useDialogStore';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';
import {
  ChannelMemberMuteDuration,
  ChannelMember,
  ChannelMemberStatus,
  ChannelMemberRole,
} from '@/types/ChannelMemberTypes';

interface ChannelMemberMutePromptProps {
  member: ChannelMember;
}

export default function ChannelMemberMutePrompt({
  member,
}: ChannelMemberMutePromptProps) {
  const currentUser = useCurrentUser();
  const channelSocket = useChannelSocket();
  const { changeChannelMemberStatus } = useChannelMemberActions();
  const { isChannelAdmin, isChannelOwner } = useChannelMemberChecks();
  const { actionClicked, backClicked } = useDialogTriggers();
  const { resetDialog, resetTriggers } = useDialogActions();
  const { displayNotification } = useNotificationActions();
  const [duration, setDuration] = useState(ChannelMemberMuteDuration.MINUTE);

  function calculateMuteUntil(): string {
    switch (duration) {
      case ChannelMemberMuteDuration.MINUTE:
        return new Date(Date.now() + 60000).toISOString();
      case ChannelMemberMuteDuration.HOUR:
        return new Date(Date.now() + 3600000).toISOString();
      case ChannelMemberMuteDuration.DAY:
        return new Date(Date.now() + 86400000).toISOString();
      case ChannelMemberMuteDuration.LIFETIME:
        return new Date(Date.now() * 100).toISOString();
    }
    return new Date().toISOString();
  }

  async function muteUser(): Promise<void> {
    if (
      (member.role === ChannelMemberRole.MEMBER &&
        isChannelAdmin(currentUser.id, member.channel.id)) ||
      (member.role !== ChannelMemberRole.OWNER &&
        isChannelOwner(currentUser.id, member.channel.id))
    ) {
      const mutedUntil = calculateMuteUntil();

      await callAPI('PATCH', 'channel-members', {
        id: member.id,
        status: ChannelMemberStatus.MUTED,
        muted_until: mutedUntil,
      });
      changeChannelMemberStatus(
        member.id,
        ChannelMemberStatus.MUTED,
        mutedUntil,
      );
      const data = {
        memberID: member.id,
        userID: member.user.id,
        channelID: member.channel.id,
        newStatus: ChannelMemberStatus.MUTED,
        mutedUntil: mutedUntil,
      };
      emitToSocket(channelSocket, 'changeStatus', data);
      displayNotification(
        'success',
        `Channel member ${member.user.username} muted`,
      );
    } else {
      throw 'You are no longer an admin, unable to unmute';
    }
  }

  useEffect(() => {
    if (actionClicked) {
      muteUser()
        .then(resetDialog)
        .catch((error) => {
          resetDialog();
          displayNotification('error', error);
        });
    }
    if (backClicked) {
      resetDialog();
    }
  }, [actionClicked, backClicked]);

  return (
    <RadioGroup
      row
      value={duration}
      onChange={(event) =>
        setDuration(event.target.value as ChannelMemberMuteDuration)
      }
    >
      <FormControlLabel
        value={ChannelMemberMuteDuration.MINUTE}
        control={<Radio />}
        label='1 min'
      />
      <FormControlLabel
        value={ChannelMemberMuteDuration.HOUR}
        control={<Radio />}
        label='1 hour'
      />
      <FormControlLabel
        value={ChannelMemberMuteDuration.DAY}
        control={<Radio />}
        label='1 day'
      />
      <FormControlLabel
        value={ChannelMemberMuteDuration.LIFETIME}
        control={<Radio />}
        label='Indefinitely'
      />
    </RadioGroup>
  );
}
