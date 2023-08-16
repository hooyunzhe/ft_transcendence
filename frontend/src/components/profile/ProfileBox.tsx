'use client';
import { Box, Typography } from '@mui/material';
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import ProfileActivity from './ProfileActivity';
import { useSelectedStatistic } from '@/lib/stores/useProfileStore';

export default function ProfileBox() {
  const selectedStatistic = useSelectedStatistic();

  return (
    <Box
      display='flex'
      height='100%'
      flexDirection='column'
      justifyContent='space-between'
      gap='1vh'
    >
      {selectedStatistic ? (
        <>
          <ProfileHeader />
          <ProfileStats />
          <ProfileActivity />
        </>
      ) : (
        <Typography
          sx={{
            opacity: '50%',
          }}
          variant='h5'
          align='center'
          marginTop='33vh'
        >
          Select a friend to view their profile
        </Typography>
      )}
    </Box>
  );
}
