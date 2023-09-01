'use client';
import { Box, Typography } from '@mui/material';

interface ProfileStatCardProps {
  description: string;
  stats: string;
}

export default function ProfileStatCard({
  description,
  stats,
}: ProfileStatCardProps) {
  return (
    <Box
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
