import ChannelMembers from '@/types/ChannelMembers';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import RemoveModeratorIcon from '@mui/icons-material/RemoveModerator';
import CommentsDisabledIcon from '@mui/icons-material/CommentsDisabled';
import CommentIcon from '@mui/icons-material/Comment';
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts';

import {
  Avatar,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import ConfirmationPrompt from './ConfirmationPrompt';
import { useState } from 'react';

interface ChannelMemberDisplayProps {
  channelMember: ChannelMembers;
  changeRole: (...args: any) => Promise<void>;
  changeStatus: (...args: any) => Promise<void>;
}

export function ChannelMemberDisplay({
  channelMember,
  changeRole,
  changeStatus,
}: ChannelMemberDisplayProps) {
  const [confirmation, setConfirmation] = useState<
    | {
        required: boolean;
        title: string;
        description: string;
        request: ChannelMembers;
        action: 'banned';
      }
    | undefined
  >();

  function handleAction(request: ChannelMembers) {
    setConfirmation({
      required: true,
      title: 'testing?',
      description: 'testing again',
      request: request,
      action: 'banned',
    });
  }

  return (
    <>
      <ListItem>
        <ListItemAvatar>
          <Avatar alt=''></Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={channelMember.user.username}
          secondary={
            'Channel Id: ' + channelMember.id + ' role: ' + channelMember.role
          }
        />
        <IconButton>
          <SportsMartialArtsIcon />
        </IconButton>
        <ConfirmationPrompt
          open={true}
          onCloseHandler={() => {
            setConfirmation(undefined);
          }}
          promptTitle='test'
          promptDescription='test'
          actionHandler={() => {
            // handleRequest(confirmation.request, confirmation.action);
            setConfirmation(undefined);
          }}
        ></ConfirmationPrompt>
        <IconButton
          onClick={() =>
            changeRole(
              channelMember.id,
              channelMember.role === 'member' ? 'admin' : 'member',
            )
          }
        >
          {channelMember.role === 'member' ? (
            <AddModeratorIcon />
          ) : (
            <RemoveModeratorIcon />
          )}
        </IconButton>
        <IconButton
          onClick={() =>
            changeStatus(
              channelMember.id,
              channelMember.status === 'muted' ? 'default' : 'muted',
            )
          }
        >
          {channelMember.status === 'muted' ? (
            <CommentsDisabledIcon />
          ) : (
            <CommentIcon />
          )}
        </IconButton>
      </ListItem>
      <Divider />
    </>
  );
}
