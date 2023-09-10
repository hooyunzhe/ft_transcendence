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
      height='80px'
      justifyContent='center'
      alignItems='center'
      sx={{
        background: 'linear-gradient(90deg, #e8514980, #363bd680)',
      }}
    >
      <Typography variant='h4' color='#DDDDDD'>
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
