'use client';

import { Box, Typography } from '@mui/material';

interface GameSkillBoxProps {
  skillName: string;
  skillDescription: string;
  children?: React.ReactNode;
}

export default function GameSkillBox({
  skillName,
  skillDescription,
  children,
}: GameSkillBoxProps) {
  return (
    <Box
      display='flex'
      justifyContent='space-evenly'
      alignItems='center'
      width='16vw'
      height='8vh'
      boxSizing='border-box'
      bgcolor='#A4B5C6'
      border='3px solid black'
      borderRadius='10px'
    >
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        width='16vw'
        height='8vh'
        borderRight='3px solid black'
        borderRadius='10px'
      >
        {children}
      </Box>
      <Box width='50vw' fontWeight='bold' padding='1vh 1vw'>
        <Typography fontSize='1.2rem'>{skillName}</Typography>
        <Typography fontSize='0.9rem'>{skillDescription}</Typography>
      </Box>
    </Box>
  );
}
