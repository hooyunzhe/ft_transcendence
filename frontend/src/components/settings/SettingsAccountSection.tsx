'use client';
import { Avatar, Box, Button, Typography } from '@mui/material';
import { useCurrentUser } from '@/lib/stores/useUserStore';

export default function SettingsAccountSection() {
  const currentUser = useCurrentUser();

  return (
    <Box
      alignSelf='center'
      width='50%'
      height='100%'
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      alignItems='center'
      padding='1.5vw'
      gap='4vh'
      border='solid 5px #7209B775'
      borderRadius='10px'
      bgcolor='#a291d275'
    >
      <Avatar
        src={currentUser.avatar_url}
        sx={{
          width: '125px',
          height: '125px',
          border: 'solid 1px black',
        }}
      />
      <Box width='100%'>
        <Typography>Username</Typography>
        <Box width='100%' display='flex' justifyContent='space-between'>
          <Typography variant='h5'>{currentUser.username}</Typography>
          <Button variant='contained'>Change</Button>
        </Box>
      </Box>
      <Box width='100%'>
        <Typography>Two-factor Authentication</Typography>
        <Box width='100%' display='flex' justifyContent='space-between'>
          <Typography variant='h5'>Not Enabled</Typography>
          <Button variant='contained'>Enable</Button>
        </Box>
      </Box>
      <Box width='100%' display='flex' justifyContent='space-between'>
        <Box>
          <Typography variant='h6'>Music</Typography>
          <Button variant='contained'>Off</Button>
        </Box>
        <Box>
          <Typography variant='h6'>Animations</Typography>
          <Button variant='contained'>Off</Button>
        </Box>
        <Box>
          <Typography variant='h6'>Light Mode</Typography>
          <Button variant='contained'>On</Button>
        </Box>
      </Box>
      <Box
        width='50%'
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
        gap='1vh'
      >
        <Button variant='contained' color='warning'>
          Log out
        </Button>
        <Button variant='contained' color='error'>
          Delete Account
        </Button>
      </Box>
    </Box>
  );
}
