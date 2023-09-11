'use client';
import { Avatar, Box, Fab, Typography } from '@mui/material';
import { useGameSocket } from '@/lib/stores/useSocketStore';
import {
  useIncomingInviteRoomID,
  useIncomingInviteUser,
} from '@/lib/stores/useGameStore';
import { useBackdropActions } from '@/lib/stores/useBackdropStore';

export default function GameNewInvite() {
  const gameSocket = useGameSocket();
  const incomingInviteUser = useIncomingInviteUser();
  const incomingInviteRoomID = useIncomingInviteRoomID();
  const { resetBackdrop } = useBackdropActions();

  function handleAccept(): void {
    if (gameSocket) {
      if (incomingInviteRoomID) {
        gameSocket.emit('acceptInvite', incomingInviteRoomID);
        resetBackdrop();
      } else {
        console.log('FATAL ERROR: INCOMING INVITE ROOM ID IS UNDEFINED');
      }
    } else {
      console.log('FATAL ERROR: GAME SOCKET IS NULL');
    }
  }

  return (
    <Box
      width='20vw'
      height='20vh'
      display='flex'
      flexDirection='column'
      justifyContent='space-around'
      alignItems='center'
      borderRadius='10px'
      bgcolor='#DDDDDD'
      onClick={(event) => event.stopPropagation()}
    >
      {incomingInviteUser && (
        <Box
          width='100%'
          height='8vh'
          display='flex'
          justifyContent='space-evenly'
          alignItems='center'
          borderRadius='10px'
          borderTop='solid 2px black'
          borderBottom='solid 2px black'
          bgcolor='#A4B5C6'
        >
          <Avatar
            src={incomingInviteUser.avatar_url}
            alt={incomingInviteUser.username}
            sx={{ width: '50px', height: '50px', border: 'solid 1px black' }}
          />
          <Typography variant='h5'>{incomingInviteUser.username}</Typography>
        </Box>
      )}
      <Typography variant='h6' color='#00000095'>
        invited you to play Cyberpong
      </Typography>
      <Fab
        variant='extended'
        onClick={(event) => {
          event.stopPropagation();
          handleAccept();
        }}
      >
        Accept
      </Fab>
    </Box>
  );
}
