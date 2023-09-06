'use client';
import { useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import GameSearch from './GameSearch';
import GameMatchFound from './GameMatchFound';
import callAPI from '@/lib/callAPI';
import { useGameSocket } from '@/lib/stores/useSocketStore';
import { useGameActions, useMatchState } from '@/lib/stores/useGameStore';
import { useBackdropActions } from '@/lib/stores/useBackdropStore';
import { GameType, MatchInfo, MatchState } from '@/types/GameTypes';

export default function GameMenu() {
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
    );

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

  const findMatch = (gameMode: GameType) => {
    if (gameMode === GameType.CLASSIC) {
      gameAction.setSelectedGameType(GameType.CLASSIC);
    } else {
      gameAction.setSelectedGameType(GameType.CYBERPONG);
    }
    if (gameSocket) {
      gameSocket.sendBuffer = [];
      gameSocket.emit('matchmake', gameMode);
      gameAction.setMatchState(MatchState.SEARCHING);
      displayBackdrop(<GameSearch />, cancelFindMatch);
    }
    console.log(matchState);
  };

  const cancelFindMatch = () => {
    if (gameSocket) gameSocket.disconnect();
    gameAction.setMatchState(MatchState.IDLE);
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
        id: player1data.id,
        nickname: player1data.username,
        avatar: player1data.avatar_url,
      },
      player2: {
        id: player2data.id,
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
          onClick={() => findMatch(GameType.CLASSIC)}
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
          onClick={() => findMatch(GameType.CYBERPONG)}
        >
          Cyberpong
        </Button>
      </Box>
    </Box>
  );
}
