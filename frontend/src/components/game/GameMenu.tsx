'use client';
import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useGameSocket } from '@/lib/stores/useSocketStore';
import GameRender from '@/components/game/GameRender';
import { useGameActions, useMatchState } from '@/lib/stores/useGameStore';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import ConfirmationPrompt from '../utils/ConfirmationPrompt';
import { useConfirmationActions } from '@/lib/stores/useConfirmationStore';
import { useCurrentView, useUtilActions } from '@/lib/stores/useUtilStore';
import { View } from '@/types/UtilTypes';
import { MatchInfo, MatchState } from '@/types/GameTypes';
import callAPI from '@/lib/callAPI';
import GameMatchFound from './GameMatchFound';

export default function GameMenu() {
  const gameSocket = useGameSocket();
  const matchState = useMatchState();
  const gameAction = useGameActions();
  const viewAction = useUtilActions();
  const userId = useCurrentUser();
  const [searchTime, setSearchTime] = useState(0);

  const fontUrl = '/assets/CyberwayRider.ttf';
  useEffect(() => {
    if (!gameSocket) return;
    gameSocket.on(
      'match',
      async (data: { player1: string; player2: string }) => {
        gameAction.setMatchState(MatchState.FOUND);

        const matchInfo = await getPlayerData(data);
        console.log(matchInfo);
        gameAction.setMatchInfo(matchInfo);
      },
    ),
      gameSocket.on('connect', () => {
        gameSocket.sendBuffer = [];
        gameSocket.emit('init', userId.id);
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
    const timer = setInterval(() => {
      if (matchState === MatchState.SEARCHING)
        setSearchTime((prevTime) => prevTime + 1);
    }, 500);

    if (matchState === MatchState.FOUND) {
      const matchFoundtimer = setTimeout(() => {
        // gameAction.setMatchState(MatchState.INGAME);
        viewAction.setCurrentView(View.LOADING);
      }, 3000);
      return () => {
        clearTimeout(matchFoundtimer);
      };
    }
    return () => {
      clearInterval(timer);
      setSearchTime(0);
    };
  }, [matchState]);

  const findMatch = () => {
    if (gameSocket) {
      gameSocket.connect();
      gameAction.setMatchState(MatchState.SEARCHING);
      gameSocket.sendBuffer = [];
      gameSocket.emit('init', userId.id);
    }
    // viewAction.setCurrentView(View.LOADING);
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

    const player1data = JSON.parse(player1response);
    const player2data = JSON.parse(player2response);

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
      justifyContent='center'
      alignItems='center'
    >
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
        <source src='/assets/mainmenu.mp4' type='video/mp4' />
      </video>
      <Typography variant='h2'>CYBERPONG</Typography>
      <Button
        variant='contained'
        onClick={findMatch}
        disabled={matchState === MatchState.SEARCHING}
      >
        Start Game
      </Button>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={matchState === MatchState.SEARCHING}
        onClick={cancelFindMatch}
      >
        <CircularProgress color='inherit' />
        <Box sx={{ ml: 2 }}>
          <Typography variant='h6'>Searching Match...</Typography>
          <Typography>Time elapsed: {searchTime} seconds</Typography>
        </Box>
      </Backdrop>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={matchState === MatchState.FOUND}
      >
        <GameMatchFound />
      </Backdrop>
    </Box>
  );
}
