'use client';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SettingsIcon from '@mui/icons-material/Settings';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import EditIcon from '@mui/icons-material/Edit';
import BrushIcon from '@mui/icons-material/Brush';
import { IconButton, ListItemIcon, MenuList, Paper } from '@mui/material';
import { useState } from 'react';
import ChannelNameChangePrompt from './ChannelNameChangePrompt';
import ChannelTypeChangePrompt from './ChannelTypeChangePrompt';
import { ChannelMemberUnbanPrompt } from '../channel-member/ChannelMemberUnbanPrompt';
import { ChannelType } from '@/types/ChannelTypes';

interface ChannelSettingsProps {
  channelID: number;
  channelType: ChannelType;
}

export default function ChannelSettings({
  channelID,
  channelType,
}: ChannelSettingsProps) {
  const [open, setOpen] = useState(false);
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);

  function handleClick(event: React.MouseEvent<HTMLElement>): void {
    setAnchorElement(event.currentTarget);
    setOpen(true);
  }
  function handleClose(): void {
    setAnchorElement(null);
    setOpen(false);
  }

  return (
    <div>
      <IconButton onClick={handleClick}>
        <SettingsIcon />
      </IconButton>
      <Menu
        anchorEl={anchorElement}
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
            <MenuItem>
              <ListItemIcon>
                <SentimentVeryDissatisfiedIcon />
              </ListItemIcon>
              <ChannelMemberUnbanPrompt />
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ChannelNameChangePrompt
                channelID={channelID}
              ></ChannelNameChangePrompt>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <BrushIcon />
              </ListItemIcon>
              <ChannelTypeChangePrompt
                channelID={channelID}
                channelType={channelType}
              ></ChannelTypeChangePrompt>
            </MenuItem>
          </MenuList>
        </Paper>
      </Menu>
    </div>
  );
}
