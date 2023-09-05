'use client';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Login from '@/components/user/Login';
import FirstTimeSetup from '@/components/user/FirstTimeSetup';
import Cyberpong from '@/components/homepage/Cyberpong';
import {
  useCurrentUser,
  useIsNewUser,
  useUserActions,
} from '@/lib/stores/useUserStore';

export default function Home() {
  const user = useCurrentUser();
  const isNewUser = useIsNewUser();
  const { getUserData } = useUserActions();
  const [session, setSession] = useState<Session | null | undefined>();

  useEffect(() => {
    async function getData() {
      const currentSession = await getSession();
      setSession(currentSession);
      if (currentSession) {
        getUserData(currentSession.intraID);
      }
    }
    getData();
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      {(session === null || isNewUser) && (
        <video
          width='100%'
          height='100%'
          autoPlay
          muted
          loop
          style={{
            position: 'absolute',
            zIndex: -1,
            objectFit: 'cover',
          }}
        >
          <source src='/assets/mainmenu.mp4' type='video/mp4' />
        </video>
      )}
      {session === null && <Login />}
      {session && isNewUser && <FirstTimeSetup session={session} />}
      {session && user.id !== 0 && <Cyberpong />}
    </Box>
  );
}
