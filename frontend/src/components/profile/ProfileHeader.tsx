'use client';
import { Avatar, Box, Typography } from '@mui/material';
import { useSelectedStatisticIndex } from '@/lib/stores/useProfileStore';
import { useRecentAchievements } from '@/lib/stores/useAchievementStore';
import { Statistic } from '@/types/StatisticTypes';

interface ProfileHeaderProps {
  statistic: Statistic;
}

export default function ProfileHeader({ statistic }: ProfileHeaderProps) {
  const selectedStatisticIndex = useSelectedStatisticIndex();
  const recentAchievements = useRecentAchievements();

  return (
    <Box
      display='flex'
      alignItems='center'
      padding='15px'
      borderRadius='10px'
      sx={{
        background: 'linear-gradient(90deg, #e8514980, #363bd680)',
      }}
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
          alt={statistic.user.username}
          sx={{
            width: '100px',
            height: '100px',
            border: 'solid 1px black',
          }}
        />
        <Box>
          <Typography
            variant='h4'
            color='#CCCCCC'
            sx={{ textShadow: '4px 4px 6px black', wordBreak: 'break-all' }}
          >
            {statistic.user.username}
          </Typography>
          <Typography
            variant='body2'
            color='#CCCCCC'
            sx={{
              textShadow: '3px 3px 5px black',
            }}
          >
            {'Joined ' +
              new Date(
                statistic.user.date_of_creation ?? '',
              ).toLocaleDateString()}
          </Typography>
        </Box>
      </Box>
      <Box width='30vw' display='flex' gap='5vw'>
        <Box>
          <Typography
            variant='h4'
            color='#CCCCCC'
            sx={{
              textShadow: '4px 4px 6px black',
            }}
          >
            {selectedStatisticIndex === undefined
              ? 'N/A'
              : '#' + (selectedStatisticIndex + 1)}
          </Typography>
          <Typography
            variant='body2'
            color='#CCCCCC'
            sx={{
              textShadow: '3px 3px 5px black',
            }}
          >
            Current Ranking
          </Typography>
        </Box>
        <Box>
          <Typography
            variant='h4'
            color='#CCCCCC'
            sx={{
              textShadow: '4px 4px 6px black',
            }}
          >
            {statistic.wins + statistic.losses}
          </Typography>
          <Typography
            variant='body2'
            color='#CCCCCC'
            sx={{
              textShadow: '3px 3px 5px black',
            }}
          >
            Matches Played
          </Typography>
        </Box>
        <Box>
          <Typography
            variant='h4'
            color='#CCCCCC'
            sx={{
              textShadow: '4px 4px 6px black',
            }}
          >
            {recentAchievements[statistic.user.id]
              ? recentAchievements[statistic.user.id].length
              : 0}
          </Typography>
          <Typography
            variant='body2'
            color='#CCCCCC'
            sx={{
              textShadow: '3px 3px 5px black',
            }}
          >
            Achievements Earned
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
