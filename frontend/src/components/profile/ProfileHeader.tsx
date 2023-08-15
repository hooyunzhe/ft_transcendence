'use client';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import { Avatar, Box, Typography } from '@mui/material';

export default function ProfileHeader() {
  const currentUser = useCurrentUser();

  return (
    <Box
      display='flex'
      justifyContent='space-around'
      alignItems='center'
      padding='15px'
      border='solid 5px #7209B775'
      borderRadius='10px'
      bgcolor='#a291d275'
    >
      <Box display='flex' alignItems='center' paddingRight='100px' gap='15px'>
        <Avatar
          src={currentUser.avatar_url}
          sx={{
            width: '100px',
            height: '100px',
            border: 'solid 1px black',
          }}
        />
        <Box>
          <Typography variant='h4'>{currentUser.username}</Typography>
          <Typography variant='body2' color='rgba(0, 0, 0, 0.6)'>
            {'Joined ' +
              new Date(currentUser.date_of_creation).toLocaleDateString()}
          </Typography>
        </Box>
      </Box>
      <Box>
        <Typography variant='h4'>#7</Typography>
        <Typography variant='body2' color='rgba(0, 0, 0, 0.6)'>
          Current Ranking
        </Typography>
      </Box>
      <Box>
        <Typography variant='h4'>5</Typography>
        <Typography variant='body2' color='rgba(0, 0, 0, 0.6)'>
          Matches Played
        </Typography>
      </Box>
      <Box>
        <Typography variant='h4'>3</Typography>
        <Typography variant='body2' color='rgba(0, 0, 0, 0.6)'>
          Achievements Earned
        </Typography>
      </Box>
    </Box>
  );
}
