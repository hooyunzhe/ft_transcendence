import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ChannelMembers, { ChannelMemberAction, ChannelMemberRole, ChannelMemberStatus } from '@/types/ChannelMemberTypes';
import { Divider, IconButton, ListItemIcon, ListItemText, MenuList, Paper, Typography } from '@mui/material';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { Cloud, ContentCopy, ContentCut, ContentPaste } from '@mui/icons-material';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import RemoveModeratorIcon from '@mui/icons-material/RemoveModerator';
import CommentsDisabledIcon from '@mui/icons-material/CommentsDisabled';
import CommentIcon from '@mui/icons-material/Comment';
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts';
import GavelRoundedIcon from '@mui/icons-material/GavelRounded';

interface ChannelMemberMenuProps {
  channelMember: ChannelMembers;
  handleAction: (...args: any) => Promise<void>;
}

export default function ChannelMemberMenu({
  channelMember,
  handleAction,
} : ChannelMemberMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const currentUserRole = ChannelMemberRole.OWNER;


  return (
    <div>
      <IconButton
        id="demo-positioned-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <ManageAccountsIcon></ManageAccountsIcon>
      </IconButton>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
          <Paper sx={{ width: 320, maxWidth: '100%' }}>
            <MenuList>
              <MenuItem onClick={() => handleAction(channelMember, ChannelMemberAction.BAN)}>
                {(channelMember.role !== ChannelMemberRole.OWNER)
                && ((currentUserRole === ChannelMemberRole.OWNER
                  || currentUserRole === ChannelMemberRole.ADMIN)
                ? (
              <>
                <ListItemIcon>
                  <GavelRoundedIcon fontSize="small" />
               </ListItemIcon>
               <ListItemText>Ban User</ListItemText>
              </>
              ) : <></>
            )}
              </MenuItem>
              <MenuItem onClick={() => {handleAction(channelMember, ChannelMemberAction.KICK)}}>
                <ListItemIcon>
                  <SportsMartialArtsIcon fontSize='small'/>
                </ListItemIcon>
               <ListItemText>Kick User</ListItemText>
              </MenuItem>
              <MenuItem onClick={() =>  {
                  if (channelMember.role === ChannelMemberRole.MEMBER) {
                    handleAction(channelMember, ChannelMemberAction.ADMIN);
                  } else {
                    handleAction(channelMember, ChannelMemberAction.UNADMIN);
                  }}}>
                {(channelMember.role !== ChannelMemberRole.OWNER)
                && ((currentUserRole === ChannelMemberRole.OWNER
                  || currentUserRole === ChannelMemberRole.ADMIN)
                ? (
              <>
                <ListItemIcon>
                  {channelMember.role === ChannelMemberRole.MEMBER ?
                  (<AddModeratorIcon />) : (<RemoveModeratorIcon />)}
               </ListItemIcon>
               <ListItemText>{channelMember.role === ChannelMemberRole.MEMBER ?
                  ("Promote to Admin") : ("Demote to Member")}
              </ListItemText>
              </>
              ) : <></>
            )}
              </MenuItem>
              <MenuItem onClick={() =>  {
                  if (channelMember.status === ChannelMemberStatus.MUTED) {
                    handleAction(channelMember, ChannelMemberAction.UNMUTE);
                  } else {
                    handleAction(channelMember, ChannelMemberAction.MUTE);
                  }}}>
                  <ListItemIcon>
                  {channelMember.status === ChannelMemberStatus.MUTED ?
                  (<CommentsDisabledIcon />) : (<CommentIcon />)}
                  </ListItemIcon>
                  <ListItemText>{channelMember.status === ChannelMemberStatus.MUTED ?
                  ("Mute User") : ("Unmute User")}
                  </ListItemText>
              </MenuItem>
             </MenuList>
         </Paper>
      </Menu>
    </div>
  );
}