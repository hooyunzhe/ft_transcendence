import { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { useGameSocket } from '@/lib/stores/useSocketStore';
import {
  useGameActions,
  useSelectedGameType,
  useSelectedSkillClass,
} from '@/lib/stores/useGameStore';
import { GameType, MatchState } from '@/types/GameTypes';
import GameSkills from './GameSkills';
import { SkillClass } from '@/types/MatchTypes';

export default function GameReady() {
  const gameSocket = useGameSocket();
  const selectedSkillClass = useSelectedSkillClass();
  const selectedGameType = useSelectedGameType();
  const gameAction = useGameActions();
  const [ready, setReady] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  console.log(selectedSkillClass);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameSocket)
      gameSocket.on('start', (roomid: string) => {
        setCooldown(true);
        gameAction.setMatchState(MatchState.INGAME);
      });
    return () => {
      clearTimeout(timer);
    };
  }, []);

  function handleSelectedClasses(): number {
    if (selectedGameType === GameType.CLASSIC) {
      return 0;
    }
    if (selectedSkillClass === SkillClass.STRENGTH) {
      return 1;
    } else if (selectedSkillClass === SkillClass.SPEED) {
      return 2;
    } else {
      return 3;
    }
  }

  const getReady = () => {
    if (!cooldown && gameSocket) {
      setReady(!ready);
      gameSocket.emit('ready', handleSelectedClasses());
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
