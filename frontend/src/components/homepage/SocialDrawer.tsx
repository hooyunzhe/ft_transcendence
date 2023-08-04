'use client';
import { Box, Drawer, Tab, Tabs } from '@mui/material';
import FriendStack from '../friend/FriendStack';
import { ChannelList } from '../channel/ChannelList';
import Image from 'next/image';
import {
  useCurrentSocialTab,
  useSocialDrawerToggle,
  useUtilActions,
} from '@/lib/stores/useUtilStore';
import { useSelectedChannel } from '@/lib/stores/useChannelStore';
import ListHeader from '../utils/ListHeader';
import { SocialTab } from '@/types/UtilTypes';

export default function SocialDrawer() {
  const currentSocialTab = useCurrentSocialTab();
  const { setCurrentSocialTab, handleDrawerMouseLeave, handleDrawerMouseOver } =
    useUtilActions();
  const socialDrawerToggle = useSocialDrawerToggle();
  const selectedChannel = useSelectedChannel();

  return (
    <Box
      onMouseOver={() => {
        handleDrawerMouseOver(selectedChannel !== undefined);
      }}
      onMouseLeave={handleDrawerMouseLeave}
    >
      <Image
        src='/ball/paddle2.png'
        width={12}
        height={110}
        alt='Paddle 1'
      ></Image>
      <Drawer
        PaperProps={{
          sx: {
            boxSizing: 'border-box',
            width: '20vw',
            height: '70vh',
            top: '15vh',
            padding: '7px',
            border: 'solid 5px #7209B775',
            borderRadius: '0 15px 15px 0',
            // background: '#3A0CA375',
          },
        }}
        variant='persistent'
        anchor='left'
        open
      >
        <ListHeader title='Social' />
        <Tabs
          sx={{
            margin: '3px',
          }}
          variant='fullWidth'
          value={currentSocialTab}
          onChange={(event, newValue) => setCurrentSocialTab(newValue)}
        >
          <Tab label='Friends' value={SocialTab.FRIEND} />
          <Tab label='Channels' value={SocialTab.CHANNEL} />
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
