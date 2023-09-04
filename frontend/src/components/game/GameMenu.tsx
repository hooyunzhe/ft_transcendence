'use client';
import { useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import GameSearch from './GameSearch';
import GameMatchFound from './GameMatchFound';
import callAPI from '@/lib/callAPI';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import { useGameSocket } from '@/lib/stores/useSocketStore';
import { useGameActions, useMatchState } from '@/lib/stores/useGameStore';
import { useBackdropActions } from '@/lib/stores/useBackdropStore';
import { MatchInfo, MatchState } from '@/types/GameTypes';

export default function GameMenu() {
  const currentUser = useCurrentUser();
  const gameSocket = useGameSocket();
  const matchState = useMatchState();
  const gameAction = useGameActions();
  const { displayBackdrop, resetBackdrop } = useBackdropActions();

  useEffect(() => {
    if (!gameSocket) return;
    gameSocket.on(
      'match',
      async (data: { player1: string; player2: string }) => {
        gameAction.setMatchState(MatchState.FOUND);

        const matchInfo = await getPlayerData(data);
        console.log(matchInfo);
        gameAction.setMatchInfo(matchInfo);
        displayBackdrop(<GameMatchFound />);
      },
    ),
      gameSocket.on('connect', () => {
        gameSocket.sendBuffer = [];
        gameSocket.emit('init', currentUser.id);
      });
    gameSocket.on('disconnect', () => {
      gameSocket.sendBuffer = [];
      console.log('game socket disconnected');
    });
    return () => {
      gameSocket.off('connect');
      gameSocket.off('disconnect');
      gameSocket.off('match');
    };
  }, []);

  useEffect(() => {
    if (matchState === MatchState.FOUND) {
      const matchFoundtimer = setTimeout(() => {
        gameAction.setMatchState(MatchState.READY);
        resetBackdrop();
      }, 3000);
      return () => {
        clearTimeout(matchFoundtimer);
      };
    }
  }, [matchState]);

  const findMatch = () => {
    if (gameSocket) {
      gameSocket.connect();
      gameSocket.sendBuffer = [];
      gameSocket.emit('init', currentUser.id);
      gameAction.setMatchState(MatchState.SEARCHING);
      displayBackdrop(<GameSearch />, cancelFindMatch);
    }
    console.log(matchState);
  };

  const startGame = () => {
    if (!gameSocket) return;
    gameSocket.emit('ready');
  };

  const cancelFindMatch = () => {
    if (gameSocket) gameSocket.disconnect();
    gameAction.setMatchState(MatchState.IDLE);
  };

  const disconnectGame = () => {
    if (!gameSocket) return;
    gameSocket.disconnect();
    gameAction.setMatchState(MatchState.IDLE);
  };

  const resetGame = () => {
    if (!gameSocket) return;
    gameSocket.emit('reset');
    gameSocket.disconnect();
  };

  async function getPlayerData(data: { player1: string; player2: string }) {
    const [player1response, player2response] = await Promise.all([
      callAPI('GET', 'users?search_type=ONE&search_number=' + data.player1),
      callAPI('GET', 'users?search_type=ONE&search_number=' + data.player2),
    ]);

    const player1data = player1response.body;
    const player2data = player2response.body;

    console.log(player1data);
    const matchInfo: MatchInfo = {
      player1: {
        nickname: player1data.username,
        avatar: player1data.avatar_url,
      },
      player2: {
        nickname: player2data.username,
        avatar: player2data.avatar_url,
      },
    };
    return matchInfo;
  }
  return (
    <Box
      height='100%'
      display='flex'
      flexDirection='column'
      justifyContent='space-evenly'
      alignItems='center'
    >
      <Typography variant='h2' color='white'>
        CYBERPONG
      </Typography>
      <Button
        variant='contained'
        sx={{
          bgcolor: '#4CC9F080',
          ':hover': {
            bgcolor: '#4CC9F060',
          },
        }}
        onClick={findMatch}
      >
        Start Game
      </Button>
    </Box>
  );
}
