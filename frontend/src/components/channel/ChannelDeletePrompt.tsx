'use client';
import { IconButton, ListItemIcon, MenuItem } from '@mui/material';
import { LocalFireDepartmentSharp } from '@mui/icons-material';
import callAPI from '@/lib/callAPI';
import { useConfirmationActions } from '@/lib/stores/useConfirmationStore';
import { useChannelActions } from '@/lib/stores/useChannelStore';

interface ChannelDeletePromptProps {
  channelID: number;
  channelName: string;
}

export default function ChannelDeletePrompt({
  channelID,
  channelName,
}: ChannelDeletePromptProps) {
  const { displayConfirmation } = useConfirmationActions();
  const { deleteChannel } = useChannelActions();

  async function deleteChannelApproved(channelID: number): Promise<string> {
    await callAPI('DELETE', 'channels', { id: channelID });
    deleteChannel(channelID);
    return '';
  }

  async function deleteChannelConfirmation(
    channelID: number,
    channelName: string,
  ) {
    console.log('Delete channel clicked \n');
    return displayConfirmation(
      'You are deleting ' + channelName + '?',
      'Boom boom kablamm!!?!??',
      channelID,
      deleteChannelApproved,
    );
  }

  return (
    <MenuItem>
      <ListItemIcon></ListItemIcon>
      <IconButton
        onClick={() => deleteChannelConfirmation(channelID, channelName)}
      >
        <LocalFireDepartmentSharp />
      </IconButton>
      Delete Channel
    </MenuItem>
  );
}
