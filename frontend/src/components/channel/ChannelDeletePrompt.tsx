'use client';
import { IconButton, ListItemIcon, MenuItem } from '@mui/material';
import { LocalFireDepartmentSharp } from '@mui/icons-material';
import callAPI from '@/lib/callAPI';
import { useConfirmationActions } from '@/lib/stores/useConfirmationStore';
import { useChannelActions } from '@/lib/stores/useChannelStore';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';
import emitToSocket from '@/lib/emitToSocket';
import { useChannelSocket } from '@/lib/stores/useSocketStore';

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
  const { displayNotification } = useNotificationActions();
  const channelSocket = useChannelSocket();

  async function deleteChannelApproved(channelID: number): Promise<string> {
    await callAPI('DELETE', 'channels', { id: channelID });
    deleteChannel(channelID);
    emitToSocket(channelSocket, 'deleteChannel', channelID);
    displayNotification('error', 'Channel deleted');
    return '';
  }

  async function deleteChannelConfirmation(
    channelID: number,
    channelName: string,
  ) {
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
