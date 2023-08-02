'use client';
import { Box, Typography } from '@mui/material';
import { useCurrentSocialTab } from '@/lib/stores/useUtilStore';
import { useSelectedFriend } from '@/lib/stores/useFriendStore';
import { useSelectedChannel } from '@/lib/stores/useChannelStore';
import { ChannelType } from '@/types/ChannelTypes';
import { SocialTab } from '@/types/UtilTypes';

export default function ChatHeader() {
  const currentSocialTab = useCurrentSocialTab();
  const selectedFriend = useSelectedFriend();
  const selectedChannel = useSelectedChannel();

  return (
    <Box
      display='flex'
      minHeight='5.5vh'
      justifyContent='center'
      alignItems='center'
      bgcolor='#363636'
    >
      <Typography variant='h4' color='white'>
        {selectedChannel &&
          (selectedChannel.type === ChannelType.DIRECT
            ? selectedFriend?.incoming_friend.username
            : selectedChannel.name)}
        {!selectedChannel &&
          'No ' +
            (currentSocialTab === SocialTab.FRIEND ? 'Friend' : 'Channel') +
            ' Selected'}
      </Typography>
    </Box>
  );
}
