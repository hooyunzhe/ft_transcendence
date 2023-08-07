'use client';
import {
  ChannelMembers,
  ChannelMemberAction,
  ChannelMemberRole,
  ChannelMemberStatus,
} from '@/types/ChannelMemberTypes';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import RemoveModeratorIcon from '@mui/icons-material/RemoveModerator';
import CommentsDisabledIcon from '@mui/icons-material/CommentsDisabled';
import CommentIcon from '@mui/icons-material/Comment';
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts';
import GavelRoundedIcon from '@mui/icons-material/GavelRounded';

import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
} from '@mui/material';

interface ChannelMemberDisplayProps {
  channelMember: ChannelMembers;
  handleAction?: (...args: any) => Promise<void>;
}

export function ChannelMemberDisplay({
  channelMember,
  handleAction,
}: ChannelMemberDisplayProps) {
  return (
    <Paper elevation={2}>
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
        {handleAction && (
          <>
            <IconButton
              onClick={() => {
                handleAction(channelMember, ChannelMemberAction.BAN);
              }}
            >
              <GavelRoundedIcon />
            </IconButton>

            <IconButton
              onClick={() => {
                handleAction(channelMember, ChannelMemberAction.KICK);
              }}
            >
              <SportsMartialArtsIcon />
            </IconButton>

            <IconButton
              onClick={() => {
                // need to think on how to handle owner
                if (channelMember.role === ChannelMemberRole.MEMBER) {
                  handleAction(channelMember, ChannelMemberAction.ADMIN);
                } else {
                  handleAction(channelMember, ChannelMemberAction.UNADMIN);
                }
              }}
            >
              {channelMember.role === ChannelMemberRole.MEMBER ? (
                <AddModeratorIcon />
              ) : (
                <RemoveModeratorIcon />
              )}
            </IconButton>
            <IconButton
              onClick={() => {
                console.log('printing muted button click');

                if (channelMember.status === ChannelMemberStatus.MUTED) {
                  handleAction(channelMember, ChannelMemberAction.UNMUTE);
                } else {
                  handleAction(channelMember, ChannelMemberAction.MUTE);
                }
              }}
            >
              {channelMember.status === ChannelMemberStatus.MUTED ? (
                <CommentsDisabledIcon />
              ) : (
                <CommentIcon />
              )}
            </IconButton>
          </>
        )}
      </ListItem>
    </Paper>
  );
}
