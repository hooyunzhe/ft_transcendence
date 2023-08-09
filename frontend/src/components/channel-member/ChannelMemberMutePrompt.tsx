import {
  useDialogActions,
  useDialogTriggers,
} from '@/lib/stores/useDialogStore';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';
import {
  ChannelMemberMuteDuration,
  ChannelMember,
} from '@/types/ChannelMemberTypes';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { useEffect, useState } from 'react';

interface ChannelMemberMutePromptProps {
  member: ChannelMember;
  muteUser: (...args: any) => Promise<void>;
}

export function ChannelMemberMutePrompt({
  member,
  muteUser,
}: ChannelMemberMutePromptProps) {
  const { actionClicked, backClicked } = useDialogTriggers();
  const { resetDialog, resetTriggers } = useDialogActions();
  const { displayNotification } = useNotificationActions();
  const [duration, setDuration] = useState(ChannelMemberMuteDuration.MINUTE);

  function calculateMuteDuration(): string {
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

  useEffect(() => {
    if (actionClicked) {
      muteUser(member, calculateMuteDuration())
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
