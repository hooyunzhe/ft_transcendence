'use client';
import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/signUp';

export default function Login() {
  const [username, setUsername] = useState('');
  const [showSession, setShowSession] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  if (session?.user) {
    router.push('/');
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {showSession && (
        <h2>
          &#123;
          <br />
          {session
            ? Object.entries(session).map((element) => {
                const [key, value] = element;
                return (
                  <div style={{ marginLeft: '30px' }}>
                    {typeof value === 'object' ? (
                      <>
                        &#123;
                        <br />
                        {Object.entries(value).map((element) => {
                          const [key, value] = element;
                          return (
                            <div style={{ marginLeft: '30px' }}>
                              {key + ': ' + ' ' + value + ','} <br />
                            </div>
                          );
                        })}
                        &#125; ,
                      </>
                    ) : (
                      key + ': ' + ' ' + value + ','
                    )}
                    <br />
                  </div>
                );
              })
            : ''}
          &#125;
        </h2>
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '20vw',
        }}
      >
        <Button
          variant='contained'
          onClick={() => setShowSession(!showSession)}
        >
          Show Session
        </Button>
        {session ? (
          <TextField
            id='username'
            label='Username'
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                signUp(username, session.refresh_token);
                router.push('/');
              }
            }}
          ></TextField>
        ) : (
          <Button variant='contained' onClick={() => signIn('42-school')}>
            Continue with 42
          </Button>
        )}
      </div>
    </Box>
  );
}
