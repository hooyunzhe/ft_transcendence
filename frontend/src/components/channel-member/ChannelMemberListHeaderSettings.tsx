import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SettingsIcon from '@mui/icons-material/Settings';

import ChannelMembers, {
  ChannelMemberAction,
  ChannelMemberRole,
  ChannelMemberStatus,
} from '@/types/ChannelMemberTypes';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuList,
  Paper,
} from '@mui/material';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

interface ChannelMemberListHeaderSettingsProps {
  channelMember: ChannelMembers;
  currentUserRole: ChannelMemberRole;
  handleAction: (...args: any) => Promise<void>;
}

export default function ChannelMemberListHeaderSettings({
  channelMember,
  currentUserRole,
  handleAction,
}: ChannelMemberListHeaderSettingsProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        id='demo-positioned-button'
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <SettingsIcon></SettingsIcon>
      </IconButton>
      <Menu
        id='demo-positioned-menu'
        aria-labelledby='demo-positioned-button'
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
      ></Menu>
    </div>
  );
}
