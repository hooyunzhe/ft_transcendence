'use client';
import { useEffect, useState } from 'react';
import { Backdrop, Box } from '@mui/material';
import GameRender from '../game/GameRender';
import SocialDrawer from './SocialDrawer';
import ContentBox from './ContentBox';
import ChannelMemberDrawer from './ChannelMemberDrawer';
import { useMatchState } from '@/lib/stores/useGameStore';
import { MatchState } from '@/types/GameTypes';

export default function MainArea() {
  const matchState = useMatchState();
  const [displayGame, setDisplayGame] = useState(false);

  useEffect(() => {
    let timeoutID: NodeJS.Timeout;

    if (matchState === MatchState.INGAME) {
      timeoutID = setTimeout(() => setDisplayGame(true), 3000);
    }

    return () => clearTimeout(timeoutID);
  }, [matchState]);

  return (
    <>
      {displayGame ? (
        <GameRender />
      ) : (
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
          <source src='/assets/background1.mp4' type='video/mp4' />
        </video>
      )}
      {!displayGame && (
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
      )}
      <Backdrop
        sx={{ bgcolor: 'black' }}
        transitionDuration={3000}
        open={matchState === MatchState.INGAME && !displayGame}
      />
    </>
  );
}
