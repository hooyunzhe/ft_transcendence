'use client';
import { useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import GameSearch from './overlay/GameSearch';
import { useGameSocket } from '@/lib/stores/useSocketStore';
import { useGameActions, useMatchState } from '@/lib/stores/useGameStore';
import { useUtilActions } from '@/lib/stores/useUtilStore';
import { useBackdropActions } from '@/lib/stores/useBackdropStore';
import { GameMode, MatchState } from '@/types/GameTypes';
import { View } from '@/types/UtilTypes';

export default function GameMenu() {
  const gameSocket = useGameSocket();
  const matchState = useMatchState();
  const gameAction = useGameActions();
  const { setCurrentView } = useUtilActions();
  const { displayBackdrop, resetBackdrop } = useBackdropActions();

  useEffect(() => {
    if (matchState === MatchState.FOUND) {
      setCurrentView(false);
      const matchFoundtimer = setTimeout(() => {
        gameAction.setMatchState(MatchState.READY);
        setCurrentView(View.GAME);
        resetBackdrop();
      }, 3000);
      return () => clearTimeout(matchFoundtimer);
    }
  }, [matchState]);

  const cancelFindMatch = () => gameAction.setMatchState(MatchState.IDLE);

  const findMatch = (gameMode: GameMode) => {
    if (gameMode === GameMode.CLASSIC) {
      gameAction.setSelectedGameMode(GameMode.CLASSIC);
    } else {
      gameAction.setSelectedGameMode(GameMode.CYBERPONG);
    }
    if (gameSocket) {
      gameSocket.sendBuffer = [];
      gameSocket.emit('matchmake', gameMode);
      gameAction.setMatchState(MatchState.SEARCHING);
      displayBackdrop(<GameSearch />, cancelFindMatch);
    }
  };

  return (
    <Box
      height='100%'
      display='flex'
      flexDirection='column'
      justifyContent='space-evenly'
      alignItems='center'
    >
      <Typography
        sx={{
          textShadow: '4px 4px 6px black',
        }}
        fontFamily='cyberfont'
        letterSpacing='1rem'
        color='#DDDDDD'
        variant='h2'
        align='center'
      >
        Cyberpong
      </Typography>
      <Box width='20vw' display='flex' justifyContent='space-between'>
        <Button
          sx={{
            width: '10vw',
            color: '#DDDDDD',
            border: 'solid 3px #363636',
            borderRadius: '15px',
            bgcolor: '#4CC9F080',
            ':hover': {
              bgcolor: '#4CC9F060',
            },
          }}
          disabled={matchState !== MatchState.IDLE}
          onClick={() => findMatch(GameMode.CLASSIC)}
        >
          Classic
        </Button>
        <Button
          sx={{
            width: '10vw',
            color: '#DDDDDD',
            border: 'solid 3px #363636',
            borderRadius: '15px',
            bgcolor: '#4CC9F080',
            ':hover': {
              bgcolor: '#4CC9F060',
            },
          }}
          disabled={matchState !== MatchState.IDLE}
          onClick={() => findMatch(GameMode.CYBERPONG)}
        >
          Cyberpong
        </Button>
      </Box>
    </Box>
  );
}
