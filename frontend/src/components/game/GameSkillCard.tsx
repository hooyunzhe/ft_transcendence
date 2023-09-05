'use client';
import {
  useGameActions,
  useSelectedSkillClass,
} from '@/lib/stores/useGameStore';
import { SkillClass } from '@/types/MatchTypes';
import {
  Android,
  EmojiObjects,
  FastForward,
  FlutterDash,
  Hardware,
  SportsKabaddi,
} from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import GameSkillBox from './GameSkillBox';
import GameSkillHeader from './GameSkillHeader';

interface GameSkillCardProps {
  skillClass: SkillClass;
}

export default function GameSkillCard({ skillClass }: GameSkillCardProps) {
  const selectedSkillClass = useSelectedSkillClass();
  const { setSelectedSkillClass } = useGameActions();

  function handleActiveNameDisplay(path: SkillClass): string {
    if (path === SkillClass.STRENGTH) {
      return 'The Grit of Cratos';
    }
    if (path === SkillClass.SPEED) {
      return 'The Celerity of Cronos';
    }
    if (path === SkillClass.TECH) {
      return 'The Insight of Cosmos';
    }
    return '';
  }

  function handleActiveDescDisplay(path: SkillClass): string {
    if (path === SkillClass.STRENGTH) {
      return 'Pulls ball to the paddle, 20s cd. Press [E] for action.';
    }
    if (path === SkillClass.SPEED) {
      return 'Slows time by 50%, 15s cd. Press [E] for action.';
    }
    if (path === SkillClass.TECH) {
      return 'Inverts paddle direction for 3s, 30s cd. Press [E] for action.';
    }
    return '';
  }

  function handlePassiveNameDisplay(path: SkillClass): string {
    if (path === SkillClass.STRENGTH) {
      return 'Cratos Might';
    }
    if (path === SkillClass.SPEED) {
      return 'Cronos Agility';
    }
    if (path === SkillClass.TECH) {
      return 'Cosmos Wisdom';
    }
    return '';
  }

  function handlePassiveDescDisplay(path: SkillClass): string {
    if (path === SkillClass.STRENGTH) {
      return 'Increases paddle size by 20% (passive)';
    }
    if (path === SkillClass.SPEED) {
      return 'Increases ball speed by 20% (passive)';
    }
    if (path === SkillClass.TECH) {
      return 'Increases paddle speed by 20% (passive)';
    }
    return '';
  }

  function handleSelectPathAction(skillClass: SkillClass) {
    setSelectedSkillClass(skillClass);
  }

  return (
    <Box>
      <GameSkillHeader skillClass={skillClass}></GameSkillHeader>
      <Box
        width='18vw'
        height='50vh'
        display='flex'
        flexDirection='column'
        justifyContent='space-evenly'
        alignItems='center'
        borderRadius='10px'
        sx={{
          background:
            skillClass === SkillClass.STRENGTH
              ? '#e8514995'
              : skillClass === SkillClass.TECH
              ? '#363bd695'
              : 'linear-gradient(90deg, #e8514995, #363bd695)',
        }}
      >
        <GameSkillBox
          skillName={handleActiveNameDisplay(skillClass)}
          skillDescription={handleActiveDescDisplay(skillClass)}
        >
          {skillClass === SkillClass.STRENGTH && <Hardware />}
          {skillClass === SkillClass.TECH && <Android />}
          {skillClass === SkillClass.SPEED && <FlutterDash />}
        </GameSkillBox>
        <GameSkillBox
          skillName={handlePassiveNameDisplay(skillClass)}
          skillDescription={handlePassiveDescDisplay(skillClass)}
        >
          {skillClass === SkillClass.STRENGTH && <SportsKabaddi />}
          {skillClass === SkillClass.TECH && <EmojiObjects />}
          {skillClass === SkillClass.SPEED && <FastForward />}
        </GameSkillBox>
        <Button
          variant='contained'
          onClick={() => handleSelectPathAction(skillClass)}
          sx={{
            backgroundColor:
              selectedSkillClass === skillClass ? 'green' : 'red',
            color: 'white',
            fontSize: '18px',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            '&:hover': {
              backgroundColor:
                selectedSkillClass === skillClass ? 'darkgreen' : 'darkred',
            },
            '&:active': {
              backgroundColor:
                selectedSkillClass === skillClass ? 'green' : 'red',
            },
          }}
        >
          Select!
        </Button>
      </Box>
    </Box>
  );
}
