'use client';
import { useGameActions, useSkillPath } from '@/lib/stores/useGameStore';
import { SkillPath } from '@/types/MatchTypes';
import {
  Android,
  EmojiObjects,
  FastForward,
  FitnessCenter,
  FlutterDash,
  Hardware,
  Psychology,
  ShutterSpeed,
  SportsKabaddi,
} from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import GameSkillBox from './GameSkillBox';
import GameSkillHeader from './GameSkillHeader';

interface GameSkillCardProps {
  skillPath: SkillPath;
}

export default function GameSkillCard({ skillPath }: GameSkillCardProps) {
  const { setSkillPath } = useGameActions();
  const selectedSkillPath = useSkillPath();

  function handleActiveNameDisplay(path: SkillPath): string {
    if (path === SkillPath.STRENGTH) {
      return 'The Grit of Cratos';
    }
    if (path === SkillPath.SPEED) {
      return 'The Celerity of Cronos';
    }
    if (path === SkillPath.TECH) {
      return 'The Insight of Cosmos';
    }
    return '';
  }

  function handleActiveDescDisplay(path: SkillPath): string {
    if (path === SkillPath.STRENGTH) {
      return 'Pulls ball to the paddle, 20s cd. Press [E] for action.';
    }
    if (path === SkillPath.SPEED) {
      return 'Slows time by 50%, 15s cd. Press [E] for action.';
    }
    if (path === SkillPath.TECH) {
      return 'Inverts paddle direction for 3s, 30s cd. Press [E] for action.';
    }
    return '';
  }

  function handlePassiveNameDisplay(path: SkillPath): string {
    if (path === SkillPath.STRENGTH) {
      return 'Cratos Might';
    }
    if (path === SkillPath.SPEED) {
      return 'Cronos Agility';
    }
    if (path === SkillPath.TECH) {
      return 'Cosmos Wisdom';
    }
    return '';
  }

  function handlePassiveDescDisplay(path: SkillPath): string {
    if (path === SkillPath.STRENGTH) {
      return 'Increases paddle size by 20% (passive)';
    }
    if (path === SkillPath.SPEED) {
      return 'Increases ball speed by 20% (passive)';
    }
    if (path === SkillPath.TECH) {
      return 'Increases paddle speed by 20% (passive)';
    }
    return '';
  }

  function handleSelectPathAction(skillPath: SkillPath) {
    setSkillPath(skillPath);
  }

  return (
    <Box>
      <GameSkillHeader skillPath={skillPath}></GameSkillHeader>
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
            skillPath === SkillPath.STRENGTH
              ? '#e8514995'
              : skillPath === SkillPath.TECH
              ? '#363bd695'
              : 'linear-gradient(90deg, #e8514995, #363bd695)',
        }}
      >
        <GameSkillBox
          skillName={handleActiveNameDisplay(skillPath)}
          skillDescription={handleActiveDescDisplay(skillPath)}
        >
          {skillPath === SkillPath.STRENGTH && <Hardware />}
          {skillPath === SkillPath.TECH && <Android />}
          {skillPath === SkillPath.SPEED && <FlutterDash />}
        </GameSkillBox>
        <GameSkillBox
          skillName={handlePassiveNameDisplay(skillPath)}
          skillDescription={handlePassiveDescDisplay(skillPath)}
        >
          {skillPath === SkillPath.STRENGTH && <SportsKabaddi />}
          {skillPath === SkillPath.TECH && <EmojiObjects />}
          {skillPath === SkillPath.SPEED && <FastForward />}
        </GameSkillBox>
        <Button
          variant='contained'
          onClick={() => handleSelectPathAction(skillPath)}
          sx={{
            backgroundColor: selectedSkillPath === skillPath ? 'green' : 'red',
            color: 'white',
            fontSize: '18px',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            '&:hover': {
              backgroundColor:
                selectedSkillPath === skillPath ? 'darkgreen' : 'darkred',
            },
            '&:active': {
              backgroundColor:
                selectedSkillPath === skillPath ? 'green' : 'red',
            },
          }}
        >
          Select!
        </Button>
      </Box>
    </Box>
  );
}
