'use client';
import { Box, Drawer, Tab, Tabs } from '@mui/material';
import Image from 'next/image';
import ListHeader from '../utils/ListHeader';
import FriendStack from '../friend/FriendStack';
import ChannelList from '../channel/ChannelList';
import {
  useCurrentSocialTab,
  useSocialDrawerToggle,
  useUtilActions,
} from '@/lib/stores/useUtilStore';
import { useCurrentPreference } from '@/lib/stores/useUserStore';
import { useSelectedChannel } from '@/lib/stores/useChannelStore';
import { ListHeaderType, SocialTab } from '@/types/UtilTypes';

export default function SocialDrawer() {
  const socialDrawerToggle = useSocialDrawerToggle();
  const currentPreference = useCurrentPreference();
  const currentSocialTab = useCurrentSocialTab();
  const selectedChannel = useSelectedChannel();
  const { setCurrentSocialTab, handleDrawerMouseLeave, handleDrawerMouseOver } =
    useUtilActions();

  return (
    <Box
      onMouseOver={() => {
        handleDrawerMouseOver(selectedChannel !== undefined);
      }}
      onMouseLeave={handleDrawerMouseLeave}
    >
      <Image
        src='/assets/redpaddle.png'
        width={12}
        height={109}
        alt='Paddle 1'
      />
      <Drawer
        PaperProps={{
          sx: {
            boxSizing: 'border-box',
            width: '20vw',
            height: '70vh',
            top: '15vh',
            border: 'solid 5px #7209B775',
            borderRadius: '0 15px 15px 0',
            bgcolor: '#11111180',
          },
        }}
        variant='persistent'
        anchor='left'
        open={socialDrawerToggle || !currentPreference.animations_enabled}
      >
        <ListHeader title='Social' type={ListHeaderType.SOCIAL} />
        <Tabs
          sx={{
            margin: '3px',
          }}
          variant='fullWidth'
          TabIndicatorProps={{
            style: {
              backgroundColor: '#A4B5C6',
            },
          }}
          value={currentSocialTab}
          onChange={(event, newValue) => setCurrentSocialTab(newValue)}
          onMouseDown={(event) => event.preventDefault()}
        >
          <Tab
            sx={{
              color: '#DDDDDD80',
              '&.Mui-selected': {
                color: '#DDDDDD',
              },
            }}
            label='Friends'
            value={SocialTab.FRIEND}
          />
          <Tab
            sx={{
              color: '#DDDDDD80',
              '&.Mui-selected': {
                color: '#DDDDDD',
              },
            }}
            label='Channels'
            value={SocialTab.CHANNEL}
          />
        </Tabs>
        {currentSocialTab === SocialTab.FRIEND ? (
          <FriendStack />
        ) : (
          <ChannelList />
        )}
      </Drawer>
    </Box>
  );
}
