import { useState } from 'react';
import { Box, Button } from '@mui/material';
import GameSkills from './skill/GameSkills';
import { useGameSocket } from '@/lib/stores/useSocketStore';
import {
  useGameActions,
  useGameReady,
  useMatchState,
  useSelectedSkillClass,
} from '@/lib/stores/useGameStore';
import { MatchState } from '@/types/GameTypes';
import { SkillClass } from '@/types/MatchTypes';

export default function GameReady() {
  const gameSocket = useGameSocket();
  const matchState = useMatchState();
  const gameReady = useGameReady();
  const selectedSkillClass = useSelectedSkillClass();
  const { setGameReady } = useGameActions();
  const [cooldown, setCooldown] = useState(false);

  function handleSelectedClasses(): number {
    if (selectedSkillClass === SkillClass.STRENGTH) {
      return 1;
    } else if (selectedSkillClass === SkillClass.SPEED) {
      return 2;
    } else if (selectedSkillClass === SkillClass.TECH) {
      return 3;
    }
    return 0;
  }

  const getReady = () => {
    if (!cooldown && gameSocket) {
      setGameReady(!gameReady);
      gameSocket.emit('ready', handleSelectedClasses());
      setCooldown(true);

      const timer = setTimeout(() => setCooldown(false), 1000);

      return () => clearTimeout(timer);
    }
  };

  return (
    <Box
      height='100%'
      display='flex'
      flexDirection='column'
      justifyContent='space-around'
      alignItems='center'
      bgcolor='#00000000'
    >
      <GameSkills />
      <Button
        variant='contained'
        onClick={getReady}
        disabled={matchState !== MatchState.READY}
        sx={{
          backgroundColor: gameReady ? 'green' : 'red',
          color: 'white',
          fontSize: '18px',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
          '&:hover': {
            backgroundColor: gameReady ? 'darkgreen' : 'darkred',
          },
          '&:active': {
            backgroundColor: gameReady ? 'green' : 'red',
          },
        }}
      >
        READY
      </Button>
    </Box>
  );
}
