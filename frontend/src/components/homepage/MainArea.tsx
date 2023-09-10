'use client';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import GameRender from '../game/GameRender';
import SocialDrawer from './SocialDrawer';
import ContentBox from './ContentBox';
import ChannelMemberDrawer from './ChannelMemberDrawer';
import { useGameActions, useMatchState } from '@/lib/stores/useGameStore';
import { useFriendActions } from '@/lib/stores/useFriendStore';
import { useChannelActions } from '@/lib/stores/useChannelStore';
import { useUtilActions } from '@/lib/stores/useUtilStore';
import { useBackdropActions } from '@/lib/stores/useBackdropStore';
import { MatchState } from '@/types/GameTypes';
import { View } from '@/types/UtilTypes';

export default function MainArea() {
  const matchState = useMatchState();
  const { setMatchState } = useGameActions();
  const { setSelectedFriend } = useFriendActions();
  const { setSelectedChannel } = useChannelActions();
  const { setCurrentView, setSocialDrawerClose } = useUtilActions();
  const { displayBackdrop, resetBackdrop } = useBackdropActions();
  const [displayGame, setDisplayGame] = useState(false);

  useEffect(() => {
    let timeoutID: NodeJS.Timeout;

    if (matchState === MatchState.INGAME) {
      timeoutID = setTimeout(() => {
        setDisplayGame(true);
        resetBackdrop();
      }, 1500);
      setCurrentView(false);
      setSelectedFriend(undefined);
      setSelectedChannel(undefined);
      setSocialDrawerClose();
      displayBackdrop(null, undefined, true);
    }

    if (matchState === MatchState.END) {
      setCurrentView(View.GAME);
      setDisplayGame(false);
      setMatchState(MatchState.IDLE);
    }

    return () => clearTimeout(timeoutID);
  }, [matchState]);

  return displayGame ? (
    <GameRender />
  ) : (
    <>
      <video
        width='100%'
        height='100%'
        autoPlay
        muted
        loop
        style={{
          position: 'absolute',
          zIndex: -1,
          objectFit: 'cover',
        }}
      >
        <source src='/assets/videos/background1.mp4' type='video/mp4' />
      </video>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          height: '70vh',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <SocialDrawer />
        <ContentBox />
        <ChannelMemberDrawer />
      </Box>
    </>
  );
}
