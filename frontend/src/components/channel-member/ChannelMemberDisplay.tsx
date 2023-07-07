import ChannelMembers, {
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
import ChannelMemberMenu from './ChannelMemberMenu';

interface ChannelMemberDisplayProps {
  channelMember: ChannelMembers;
  handleAction: (...args: any) => Promise<void>;
}

// * TEMPORARY BULLSHIT * //
const currentUserRole = ChannelMemberRole.OWNER;


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
            'User Id: ' + channelMember.user.id + ' role: ' + channelMember.role
          }
        />
        <ChannelMemberMenu
        channelMember={channelMember}
         handleAction={handleAction}
        />
        {/* {handleAction && (channelMember.role !== ChannelMemberRole.OWNER)
        && ((currentUserRole === ChannelMemberRole.OWNER
          || currentUserRole === ChannelMemberRole.ADMIN)
          ? (
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
            {
              (currentUserRole === ChannelMemberRole.OWNER) && (
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
              </IconButton>)}
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
          </>) : <></>
        )} */}
      </ListItem>
    </Paper>
  );
}
