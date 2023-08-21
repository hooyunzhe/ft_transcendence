'use client';
import { Avatar, Box, Typography } from '@mui/material';
import { useRecentAchievements } from '@/lib/stores/useAchievementStore';
import { Statistic } from '@/types/StatisticTypes';

interface ProfileHeaderProps {
  statistic: Statistic;
}

export default function ProfileHeader({ statistic }: ProfileHeaderProps) {
  const recentAchievements = useRecentAchievements();

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
          src={statistic.user.avatar_url}
          sx={{
            width: '100px',
            height: '100px',
            border: 'solid 1px black',
          }}
        />
        <Box>
          <Typography variant='h4'>{statistic.user.username}</Typography>
          <Typography variant='body2' color='rgba(0, 0, 0, 0.6)'>
            {'Joined ' +
              new Date(
                statistic.user.date_of_creation ?? '',
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
            {statistic.wins + statistic.losses}
          </Typography>
          <Typography variant='body2' color='rgba(0, 0, 0, 0.6)'>
            Matches Played
          </Typography>
        </Box>
        <Box>
          <Typography variant='h4'>
            {recentAchievements[statistic.user.id]
              ? recentAchievements[statistic.user.id].length
              : 0}
          </Typography>
          <Typography variant='body2' color='rgba(0, 0, 0, 0.6)'>
            Achievements Earned
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
