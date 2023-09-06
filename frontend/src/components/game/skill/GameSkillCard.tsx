'use client';
import { Box, Typography } from '@mui/material';
import {
  Android,
  EmojiObjects,
  FastForward,
  FlutterDash,
  Hardware,
  SportsKabaddi,
} from '@mui/icons-material';
import GameSkillHeader from './GameSkillHeader';
import GameSkillBox from './GameSkillBox';
import {
  useGameActions,
  useGameReady,
  useSelectedGameMode,
  useSelectedSkillClass,
} from '@/lib/stores/useGameStore';
import { SkillClass } from '@/types/MatchTypes';
import { GameMode } from '@/types/GameTypes';

interface GameSkillCardProps {
  skillClass: SkillClass;
}

export default function GameSkillCard({ skillClass }: GameSkillCardProps) {
  const gameReady = useGameReady();
  const selectedGameMode = useSelectedGameMode();
  const selectedSkillClass = useSelectedSkillClass();
  const { setSelectedSkillClass } = useGameActions();

  function handleActiveNameDisplay(skillClass: SkillClass): string {
    if (skillClass === SkillClass.STRENGTH) {
      return 'The Grit of Cratos';
    }
    if (skillClass === SkillClass.SPEED) {
      return 'The Celerity of Chronos';
    }
    if (skillClass === SkillClass.TECH) {
      return 'The Insight of Cosmos';
    }
    return '';
  }

  function handleActiveDescDisplay(skillClass: SkillClass): React.ReactNode {
    if (skillClass === SkillClass.STRENGTH) {
      return (
        <Typography component={'span'}>
          <b style={{ color: 'purple' }}>Pulls ball to own paddle, </b> 15s cd.
          Press<b style={{ fontWeight: 800 }}> [E]. </b>
        </Typography>
      );
    }
    if (skillClass === SkillClass.SPEED) {
      return (
        <Typography component={'span'}>
          <b style={{ color: 'purple' }}>Slows downs everyone's time </b>for 3s,
          20s cd. Press<b style={{ fontWeight: 800 }}> [E]. </b>
        </Typography>
      );
    }
    if (skillClass === SkillClass.TECH) {
      return (
        <Typography component={'span'}>
          <b style={{ color: 'purple' }}>
            Inverts opponent's paddle direction{' '}
          </b>
          for 3s, 30s cd. Press<b style={{ fontWeight: 800 }}> [E]. </b>
        </Typography>
      );
    }
    return '';
  }

  function handlePassiveNameDisplay(skillClass: SkillClass): string {
    if (skillClass === SkillClass.STRENGTH) {
      return 'Cratos Might';
    }
    if (skillClass === SkillClass.SPEED) {
      return 'Cronos Agility';
    }
    if (skillClass === SkillClass.TECH) {
      return 'Cosmos Wisdom';
    }
    return '';
  }

  function handlePassiveDescDisplay(skillClass: SkillClass): React.ReactNode {
    if (skillClass === SkillClass.STRENGTH) {
      return (
        <Typography component={'span'}>
          Increases <b style={{ color: 'purple' }}>paddle size</b> by 20%
        </Typography>
      );
    }
    if (skillClass === SkillClass.SPEED) {
      return (
        <Typography component={'span'}>
          Increases <b style={{ color: 'purple' }}>ball speed</b> by 20%
        </Typography>
      );
    }
    if (skillClass === SkillClass.TECH) {
      return (
        <Typography component={'span'}>
          Increases <b style={{ color: 'purple' }}>paddle speed</b> by 20%
        </Typography>
      );
    }
  }

  function handleSelectSkillAction(skillClass: SkillClass) {
    if (selectedGameMode == GameMode.CYBERPONG && !gameReady) {
      setSelectedSkillClass(skillClass);
    }
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
        boxSizing='border-box'
        borderRadius='10px'
        onClick={() => handleSelectSkillAction(skillClass)}
        sx={{
          border:
            skillClass === selectedSkillClass ? 'solid 3px yellow' : 'none',
          background:
            skillClass === SkillClass.STRENGTH
              ? '#e8514995'
              : skillClass === SkillClass.TECH
              ? '#363bd695'
              : 'linear-gradient(90deg, #e8514995, #363bd695)',
          filter:
            selectedGameMode == GameMode.CLASSIC || gameReady
              ? 'grayscale(70%)'
              : 'none',
        }}
      >
        <GameSkillBox
          skillType='active'
          skillName={handleActiveNameDisplay(skillClass)}
          skillDescription={handleActiveDescDisplay(skillClass)}
        >
          {skillClass === SkillClass.STRENGTH && (
            <Hardware
              sx={{
                fontSize: '2.5rem',
              }}
            />
          )}
          {skillClass === SkillClass.TECH && (
            <Android
              sx={{
                fontSize: '2.5rem',
              }}
            />
          )}
          {skillClass === SkillClass.SPEED && (
            <FlutterDash
              sx={{
                fontSize: '2.5rem',
              }}
            />
          )}
        </GameSkillBox>
        <GameSkillBox
          skillType='passive'
          skillName={handlePassiveNameDisplay(skillClass)}
          skillDescription={handlePassiveDescDisplay(skillClass)}
        >
          {skillClass === SkillClass.STRENGTH && (
            <SportsKabaddi
              sx={{
                fontSize: '2.5rem',
              }}
            />
          )}
          {skillClass === SkillClass.TECH && (
            <EmojiObjects
              sx={{
                fontSize: '2.5rem',
              }}
            />
          )}
          {skillClass === SkillClass.SPEED && (
            <FastForward
              sx={{
                fontSize: '2.5rem',
              }}
            />
          )}
        </GameSkillBox>
      </Box>
    </Box>
  );
}
