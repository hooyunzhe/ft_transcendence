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
import { useChannelMemberChecks } from '@/lib/stores/useChannelMemberStore';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import ChannelDeletePrompt from './ChannelDeletePrompt';
import ChannelPassChangePrompt from './ChannelPassChangePrompt';
import { Key } from '@mui/icons-material';

interface ChannelSettingsProps {
  channelID: number;
  channelName: string;
  channelType: ChannelType;
  channelHash: string;
}

export default function ChannelSettings({
  channelID,
  channelName,
  channelType,
  channelHash,
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
            <ChannelDeletePrompt
              channelID={channelID}
              channelName={channelName}
            />
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
                <Key />
              </ListItemIcon>
              <ChannelPassChangePrompt
                channelID={channelID}
                channelHash={channelHash}
              ></ChannelPassChangePrompt>
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
