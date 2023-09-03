import { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { useGameSocket } from '@/lib/stores/useSocketStore';
import { useGameActions } from '@/lib/stores/useGameStore';
import { MatchState } from '@/types/GameTypes';

export default function GameReady() {
  const gameSocket = useGameSocket();
  const gameAction = useGameActions();
  const [ready, setReady] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameSocket)
      gameSocket.on('start', () => {
        setCooldown(true);
        gameAction.setMatchState(MatchState.INGAME);
      });
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const getReady = () => {
    if (!cooldown && gameSocket) {
      setReady(!ready);
      gameSocket.emit('ready');
      setCooldown(true);

      const timer = setTimeout(() => {
        setCooldown(false);
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  };
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#0e0e2a',
      }}
    >
      <p style={{ color: 'white', fontSize: '24px', marginBottom: '20px' }}>
        GET READY
      </p>
      <Button
        variant='contained'
        onClick={getReady}
        sx={{
          backgroundColor: ready ? 'green' : 'red',
          color: 'white',
          fontSize: '18px',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
          '&:hover': {
            backgroundColor: ready ? 'darkgreen' : 'darkred',
          },
          '&:active': {
            backgroundColor: ready ? 'green' : 'red',
          },
        }}
      >
        READY
      </Button>
    </Box>
  );
}
