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
        background: '#4361EE',
      }}
    >
      {session === null && <Login />}
      {session && isNewUser && <FirstTimeSetup session={session} />}
      {session && user.id !== 0 && <Cyberpong />}
    </Box>
  );
}
