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
  handleAction: (...args: any) => Promise<void>;
  promptHandler: (...args: any) => Promise<void>;
}

export function ChannelMemberDisplay({
  channelMember,
  handleAction,
  promptHandler,
}: ChannelMemberDisplayProps) {
  const [ifPromptOpen, setPromptOpen] = useState<boolean>(false);
  // const [confirmation, setConfirmation] = useState<
  //   | {
  //       required: boolean;
  //       title: string;
  //       description: string;
  //       request: ChannelMembers | undefined;
  //       action: 'banned';
  //     }
  //   | undefined
  // >();

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
        <IconButton
          onClick={() => {
            ifPromptOpen === true ? setPromptOpen(false) : setPromptOpen(true);
            console.log(ifPromptOpen);
            promptHandler(ifPromptOpen);
          }}
        >
          <SportsMartialArtsIcon />
        </IconButton>

        {
          
        }
        <IconButton
          onClick={() => {
            // need to think on how to handle owner
            if (channelMember.role === 'admin')
              handleAction(channelMember, { role: 'member' });
            else {
              handleAction(channelMember, { role: 'admin' });
            }
          }}
        >
          {channelMember.role === 'member' ? (
            <AddModeratorIcon />
          ) : (
            <RemoveModeratorIcon />
          )}
        </IconButton>
        <IconButton
          onClick={() => {
            if (channelMember.status === 'muted') {
              handleAction(channelMember, { status: 'default' });
            } else {
              handleAction(channelMember, { status: 'muted' });
            }
          }}
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
