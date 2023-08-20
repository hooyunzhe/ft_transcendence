'use client';
import { Box, Drawer, Tab, Tabs } from '@mui/material';
import Image from 'next/image';
import ListHeader from '../utils/ListHeader';
import FriendStack from '../friend/FriendStack';
import { ChannelList } from '../channel/ChannelList';
import { useSelectedChannel } from '@/lib/stores/useChannelStore';
import {
  useCurrentSocialTab,
  useSocialDrawerToggle,
  useUtilActions,
} from '@/lib/stores/useUtilStore';
import { ListHeaderIcon, SocialTab } from '@/types/UtilTypes';

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
      <Image src='/assets/paddle2.png' width={12} height={110} alt='Paddle 1' />
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
          },
        }}
        variant='persistent'
        anchor='left'
        open={socialDrawerToggle}
      >
        <ListHeader title='Social' icon={ListHeaderIcon.SOCIAL} />
        <Tabs
          sx={{
            margin: '3px',
          }}
          variant='fullWidth'
          value={currentSocialTab}
          onChange={(event, newValue) => setCurrentSocialTab(newValue)}
          onMouseDown={(event) => event.preventDefault()}
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
