import { SkillClass } from '@/types/MatchTypes';
import { FitnessCenter, Psychology, ShutterSpeed } from '@mui/icons-material';
import { Box, ListItemIcon, Typography } from '@mui/material';

interface GameSkillHeaderProps {
  skillClass: SkillClass;
}

export default function GameSkillHeader({ skillClass }: GameSkillHeaderProps) {
  return (
    <Box
      width='18vw'
      height='6.5vh'
      display='flex'
      alignItems='center'
      justifyContent='center'
    >
      <Box display='flex' alignItems='center'>
        <Typography justifyContent='center' variant='h4' color='#DDDDDD'>
          {skillClass === SkillClass.STRENGTH && 'CRATOS'}
          {skillClass === SkillClass.SPEED && 'CRONOS'}
          {skillClass === SkillClass.TECH && 'COSMOS'}
        </Typography>
        <Box>
          <ListItemIcon sx={{ minWidth: '0px' }}>
            {skillClass === SkillClass.STRENGTH && (
              <FitnessCenter
                sx={{
                  color: '#DDDDDD',
                }}
                fontSize='large'
              />
            )}
            {skillClass === SkillClass.SPEED && (
              <ShutterSpeed
                sx={{
                  color: '#DDDDDD',
                }}
                fontSize='large'
              />
            )}
            {skillClass === SkillClass.TECH && (
              <Psychology
                sx={{
                  color: '#DDDDDD',
                }}
                fontSize='large'
              />
            )}
          </ListItemIcon>
        </Box>
      </Box>
    </Box>
  );
}
