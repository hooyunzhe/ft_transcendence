'use client';
import { Box, Typography } from '@mui/material';
import { useSelectedStatistic } from '@/lib/stores/useProfileStore';
import { useGameActions } from '@/lib/stores/useGameStore';
import ProfileMatchDisplay from './ProfileMatchDisplay';

export default function ProfileMatchHistory() {
  const selectedStatistic = useSelectedStatistic();
  const { getRecentMatchHistory } = useGameActions();

  return (
    <Box
      width='28vw'
      height='36vh'
      display='flex'
      flexDirection='column'
      justifyContent='flex-start'
      padding='5px'
      gap='1vh'
      border='solid 5px #7209B775'
      borderRadius='10px'
      bgcolor='#a291d275'
    >
      {selectedStatistic &&
      selectedStatistic.wins + selectedStatistic.losses > 0 ? (
        getRecentMatchHistory(selectedStatistic.user.id).map((match) => (
          <ProfileMatchDisplay
            match={match}
            currentPlayer={selectedStatistic.user}
          />
        ))
      ) : (
        <Typography
          sx={{
            opacity: '50%',
          }}
          variant='h5'
          align='center'
          marginTop='16vh'
        >
          No matches played
        </Typography>
      )}
    </Box>
  );
}
