'use client';
import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Backdrop, Box, Button, CircularProgress, Typography } from '@mui/material';
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
  const { displayConfirmation } = useConfirmationActions();


  useEffect(() => {
    if (!gameSocket) return;
    gameSocket.on('match', async (data: {player1: string, player2: string}) => {
      gameAction.setMatchState(MatchState.FOUND);
      console.log('match found');
      // displayConfirmation(
      //   'Match Found',
      //   'Would you like to accept the match?',
      //   null,
      //   joinGame,
      //   rejectGame,
      // );
      const matchInfo = await getPlayerData(data);
      gameAction.setMatchInfo(matchInfo);

    }),
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
        setSearchTime((prevTime) => 
      prevTime + 1);
    }, 500);

    if (matchState === MatchState.FOUND)
    {
      const matchFoundtimer = setTimeout(() =>{
        // gameAction.setMatchState(MatchState.INGAME);
        viewAction.setCurrentView(View.LOADING);
    }, 3000);
    return () => {
      clearTimeout(matchFoundtimer);
    }
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
    if (gameSocket) 
      gameSocket.disconnect();
      gameAction.setMatchState(MatchState.IDLE);
  }

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

  const joinGame = () => {
    if (gameSocket) gameSocket.emit('join');
    gameAction.setMatchState(MatchState.FOUND);
    // viewAction.setCurrentView(View.LOADING);
  };

  const rejectGame = () => {
    if (gameSocket) gameSocket.emit('reject');
    gameAction.setMatchState(MatchState.IDLE);
  };

  async function getPlayerData (data: {player1: string, player2: string})
  {
  
    console.log("data is ", data);
    const [player1response, player2response] = await Promise.all([
      callAPI('GET', 'users?search_type=ONE&search_number=' + data.player1),
      callAPI('GET', 'users?search_type=ONE&search_number=' + data.player2),
    ])

    const player1data = JSON.parse(player1response);
    const player2data = JSON.parse(player2response);

    const matchInfo: MatchInfo = {
      player1:{
        nickname: player1data.nickname,
        avatar: player1data.avatar_url,
      },
      player2:{
        nickname: player2data.nickname,
        avatar: player2data.avatar_url,
      }
    }
    return matchInfo;
  }
  return (
    <Box
      height='100%'
      display='flex'
      justifyContent='center'
      alignItems='center'
    >
      <Button
        variant='contained'
        onClick={findMatch}
        disabled={matchState === MatchState.SEARCHING}
      >
        Find Match
      </Button>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={matchState === MatchState.SEARCHING}
        onClick={cancelFindMatch} 
      >
        <CircularProgress color="inherit" />
        <Box sx={{ ml: 2 }}>
          <Typography variant="h6">Searching Match...</Typography>
          <Typography>Time elapsed: {searchTime} seconds</Typography>
        </Box>
      </Backdrop>
      <Backdrop
         sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
         open={matchState === MatchState.FOUND}>
          < GameMatchFound />
         </Backdrop>
      {/* <Button onClick={CheckStatus}>Check Status </Button> */}
      <Button
        variant='contained'
        onClick={startGame}
        disabled={matchState != MatchState.FOUND}
      >
        Start Game
      </Button>
      <Button
        variant='contained'
        onClick={resetGame}
        // disabled={matchState != MatchState.FOUND}
      >
        Reset
      </Button>

      <Button onClick={disconnectGame}>Disconnect</Button>
      {/* {matchState === 'FOUND' && ( */}

      {/* )} */}
    </Box>
  );
}
