'use client';
import { Box, Typography } from '@mui/material';

interface ProfileStatCardProps {
  alignEnd?: boolean;
  description: string;
  stats: string;
}

export default function ProfileStatCard({
  alignEnd,
  description,
  stats,
}: ProfileStatCardProps) {
  return (
    <Box
      alignSelf={alignEnd ? 'flex-end' : 'flex-start'}
      width='11vw'
      height='12vh'
      display='flex'
      flexDirection='column'
      justifyContent='space-evenly'
      alignItems='center'
      borderRadius='10px'
      bgcolor='#a291d275'
    >
      <Typography variant='body1' color='rgba(0, 0, 0, 0.6)'>
        {description}
      </Typography>
      <Typography variant='h4'>{stats}</Typography>
    </Box>
  );
}
