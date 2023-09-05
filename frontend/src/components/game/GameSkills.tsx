'use client';
import { Box } from '@mui/material';
import GameSkillCard from './GameSkillCard';
import { SkillPath } from '@/types/MatchTypes';

export default function GameSkills() {
  return (
    <Box
      display='flex'
      justifyContent='space-around'
      alignItems='center'
      gap='3vh'
    >
      {Object.keys(SkillPath).map((category, index) => (
        <GameSkillCard key={index} skillPath={category as SkillPath} />
      ))}
    </Box>
  );
}
