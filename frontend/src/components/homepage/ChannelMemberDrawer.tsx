'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Box, Drawer } from '@mui/material';
import ToolbarHeader from '../utils/ToolbarHeader';
import ChannelMemberList from '../channel-member/ChannelMemberList';
import {
  useChannelMemberDrawerToggle,
  useShowChannelMemberPaddle,
  useUtilActions,
} from '@/lib/stores/useUtilStore';
import { useCurrentPreference } from '@/lib/stores/useUserStore';
import { useSelectedChannel } from '@/lib/stores/useChannelStore';
import { Channel, ChannelType } from '@/types/ChannelTypes';
import { ToolbarHeaderType } from '@/types/UtilTypes';

export default function ChannelMemberDrawer() {
  const channelMemberDrawerToggle = useChannelMemberDrawerToggle();
  const showChannelMemberPaddle = useShowChannelMemberPaddle();
  const currentPreference = useCurrentPreference();
  const selectedChannel = useSelectedChannel();
  const {
    setChannelMemberDrawerOpen,
    setChannelMemberDrawerClose,
    handleDrawerMouseEnter,
    handleDrawerMouseLeave,
    setShowChannelMemberPaddle,
  } = useUtilActions();
  const [toggleTimeoutID, setToggleTimeoutID] = useState<
    NodeJS.Timeout | undefined
  >();
  const [localSelectedChannel, setLocalSelectedChannel] = useState<
    Channel | undefined
  >();

  useEffect(() => {
    clearTimeout(toggleTimeoutID);
    if (selectedChannel) {
      if (channelMemberDrawerToggle && currentPreference.animations_enabled) {
        setChannelMemberDrawerClose();
        setToggleTimeoutID(
          setTimeout(() => {
            setLocalSelectedChannel(selectedChannel);
            setChannelMemberDrawerOpen();
          }, 750),
        );
      } else {
        setLocalSelectedChannel(selectedChannel);
        setChannelMemberDrawerOpen();
        setShowChannelMemberPaddle(false);
      }
    } else {
      if (currentPreference.animations_enabled) {
        setToggleTimeoutID(
          setTimeout(() => {
            setShowChannelMemberPaddle(true);
          }, 500),
        );
      } else {
        setLocalSelectedChannel(undefined);
      }
      setChannelMemberDrawerClose();
    }

    return () => clearTimeout(toggleTimeoutID);
  }, [selectedChannel]);

  return (
    <Box
      onMouseEnter={() => handleDrawerMouseEnter(selectedChannel !== undefined)}
      onMouseLeave={handleDrawerMouseLeave}
    >
      {currentPreference.animations_enabled && showChannelMemberPaddle && (
        <Image
          src='/assets/textures/bluepaddle.png'
          width={12}
          height={109}
          style={{
            width: '18px',
            height: '163.5px',
          }}
          alt='Blue Paddle'
        />
      )}
      <Drawer
        PaperProps={{
          sx: {
            boxSizing: 'border-box',
            width: '20vw',
            height: '70vh',
            top: '15vh',
            border: 'solid 5px #7209B775',
            borderRadius: '15px 0 0 15px',
            bgcolor: '#00000000',
          },
        }}
        variant='persistent'
        anchor='right'
        transitionDuration={500}
        open={
          channelMemberDrawerToggle || !currentPreference.animations_enabled
        }
      >
        <ToolbarHeader
          title={
            !localSelectedChannel
              ? ''
              : localSelectedChannel.type === ChannelType.DIRECT
              ? 'Direct Message'
              : 'Members'
          }
          type={
            !localSelectedChannel
              ? ToolbarHeaderType.NONE
              : localSelectedChannel.type === ChannelType.DIRECT
              ? ToolbarHeaderType.DIRECT_MESSAGE
              : ToolbarHeaderType.CHANNEL_MEMBER
          }
        />
        <ChannelMemberList selectedChannel={localSelectedChannel} />
      </Drawer>
    </Box>
  );
}
