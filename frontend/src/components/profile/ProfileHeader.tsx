'use client';
import { Avatar, Box, Typography } from '@mui/material';
import { useSelectedStatistic } from '@/lib/stores/useProfileStore';

export default function ProfileHeader() {
  const selectedStatistic = useSelectedStatistic();

  return (
    <Box
      display='flex'
      alignItems='center'
      padding='15px'
      border='solid 5px #7209B775'
      borderRadius='10px'
      bgcolor='#a291d275'
    >
      <Box
        width='27vw'
        display='flex'
        alignItems='center'
        paddingLeft='3vw'
        gap='2vw'
      >
        <Avatar
          src={selectedStatistic?.user.avatar_url}
          sx={{
            width: '100px',
            height: '100px',
            border: 'solid 1px black',
          }}
        />
        <Box>
          <Typography variant='h4'>
            {selectedStatistic?.user.username}
          </Typography>
          <Typography variant='body2' color='rgba(0, 0, 0, 0.6)'>
            {'Joined ' +
              new Date(
                selectedStatistic?.user.date_of_creation ?? '',
              ).toLocaleDateString()}
          </Typography>
        </Box>
      </Box>
      <Box width='30vw' display='flex' gap='5vw'>
        <Box>
          <Typography variant='h4'>#7</Typography>
          <Typography variant='body2' color='rgba(0, 0, 0, 0.6)'>
            Current Ranking
          </Typography>
        </Box>
        <Box>
          <Typography variant='h4'>
            {selectedStatistic
              ? selectedStatistic.wins + selectedStatistic.losses
              : 0}
          </Typography>
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
    </Box>
  );
}
