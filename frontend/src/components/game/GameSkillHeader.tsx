import { SkillPath } from '@/types/MatchTypes';
import { FitnessCenter, Psychology, ShutterSpeed } from '@mui/icons-material';
import { Box, ListItemIcon, Typography } from '@mui/material';

interface GameSkillHeaderProps {
  skillPath: SkillPath;
}

export default function GameSkillHeader({ skillPath }: GameSkillHeaderProps) {
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
          {skillPath === SkillPath.STRENGTH && 'CRATOS'}
          {skillPath === SkillPath.SPEED && 'CRONOS'}
          {skillPath === SkillPath.TECH && 'COSMOS'}
        </Typography>
        <Box>
          <ListItemIcon sx={{ minWidth: '0px' }}>
            {skillPath === SkillPath.STRENGTH && (
              <FitnessCenter
                sx={{
                  color: '#DDDDDD',
                }}
                fontSize='large'
              />
            )}
            {skillPath === SkillPath.SPEED && (
              <ShutterSpeed
                sx={{
                  color: '#DDDDDD',
                }}
                fontSize='large'
              />
            )}
            {skillPath === SkillPath.TECH && (
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
