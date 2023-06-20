import ChannelMembers, {
  ChannelMemberRole,
  ChannelMemberStatus,
} from '@/types/ChannelMembers';
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

interface ChannelMemberDisplayProps {
  channelMember: ChannelMembers;
  handleAction: (...args: any) => Promise<void>;
}

export function ChannelMemberDisplay({
  channelMember,
  handleAction,
}: ChannelMemberDisplayProps) {
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
            handleAction(channelMember, ChannelMemberStatus.BANNED);
          }}
        >
          <SportsMartialArtsIcon />
        </IconButton>

        {}
        <IconButton
          onClick={() => {
            console.log('printing admin button click');
            // need to think on how to handle owner
            if (channelMember.role === ChannelMemberRole.MEMBER) {
              handleAction(channelMember, ChannelMemberRole.ADMIN);
            } else {
              handleAction(channelMember, ChannelMemberRole.MEMBER);
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
              handleAction(channelMember, ChannelMemberStatus.DEFAULT);
            } else {
              handleAction(channelMember, ChannelMemberStatus.MUTED);
            }
          }}
        >
          {channelMember.status === ChannelMemberStatus.MUTED ? (
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
