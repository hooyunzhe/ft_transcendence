'use client';

import { Box, Typography } from '@mui/material';

interface GameSkillBoxProps {
  skillType: 'active' | 'passive';
  skillName: string;
  skillDescription: React.ReactNode;
  children?: React.ReactNode;
}

export default function GameSkillBox({
  skillType,
  skillName,
  skillDescription,
  children,
}: GameSkillBoxProps) {
  return (
    <Box border='3px solid black' borderRadius='10px' bgcolor='#A4B5C6'>
      <Box
        display='flex'
        justifyContent='space-evenly'
        alignItems='center'
        padding='auto'
        borderBottom='3px solid black'
      >
        <Typography
          fontSize='1rem'
          sx={{
            background:
              skillType === 'active'
                ? 'linear-gradient(90deg, #e85149, #363bd6)'
                : 'linear-gradient(90deg, rgba(2,158,10,1) 0%, rgba(4,136,163,1) 100%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            fontWeight: '800',
          }}
        >
          {skillType}
        </Typography>
      </Box>
      <Box
        display='flex'
        justifyContent='space-evenly'
        alignItems='center'
        width='16vw'
        height='8vh'
        borderBottom='3px solid black'
      >
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          width='30%'
          height='8vh'
          borderRight='3px solid black'
        >
          {children}
        </Box>
        <Box width='50%' padding='1vh 1vw'>
          <Typography fontSize='1.2rem'>{skillName}</Typography>
        </Box>
      </Box>
      <Box
        display='flex'
        justifyContent='space-evenly'
        alignItems='center'
        width='14.4vw'
        height='8vh'
        paddingLeft='0.8vw'
        paddingRight='0.8vw'
      >
        {skillDescription}
      </Box>
    </Box>
  );
}
