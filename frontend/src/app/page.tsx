'use client';
import { useEffect, useState } from 'react';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { Box } from '@mui/material';
import { useCurrentUser, useUserActions } from '@/lib/stores/useUserStore';
import Login from '@/components/user/Login';
import FirstTimeSetup from '@/components/user/FirstTimeSetup';
import Cyberpong from '@/components/Cyberpong';

export default function Home() {
  const [session, setSession] = useState<Session | null | undefined>();
  const user = useCurrentUser();
  const { setCurrentUser } = useUserActions();

  useEffect(() => {
    async function getData() {
      const currentSession = await getSession();

      setSession(currentSession);
      if (currentSession) {
        fetch(
          `http://localhost:4242/api/users?search_type=TOKEN&search_string=${currentSession.refresh_token}`,
          {
            cache: 'no-store',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          },
        )
          .then((res) => (res.ok ? res.json() : null))
          .then((currentUser) => {
            // if (currentUser) {
            setCurrentUser(currentUser);
            // }
          });
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
        flexDirection: 'row',
        minHeight: '100vh',
      }}
    >
      {session === null && <Login />}
      {session && user === null && (
        <FirstTimeSetup refresh_token={session.refresh_token} />
      )}
      {session && user && user.id !== 0 && <Cyberpong />}
    </Box>
  );
}
