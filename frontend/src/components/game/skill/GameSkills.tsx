'use client';
import { Box } from '@mui/material';
import GameSkillCard from './GameSkillCard';
import { SkillClass } from '@/types/MatchTypes';

export default function GameSkills() {
  return (
    <Box
      display='flex'
      justifyContent='space-around'
      alignItems='center'
      gap='3vh'
    >
      {Object.keys(SkillClass).map((category, index) => (
        <GameSkillCard key={index} skillClass={category as SkillClass} />
      ))}
    </Box>
  );
}
