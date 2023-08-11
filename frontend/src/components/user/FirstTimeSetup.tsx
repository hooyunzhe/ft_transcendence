'use client';
import signUp from '@/lib/signUp';
import { useUserActions } from '@/lib/stores/useUserStore';
import { Avatar, Box, Grow, Slide, TextField, Typography } from '@mui/material';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

interface FirstTimeSetupProps {
  session: Session;
}

export default function FirstTimeSetup({ session }: FirstTimeSetupProps) {
  const { setCurrentUser } = useUserActions();
  const [username, setUsername] = useState('');
  const [intraID, setIntraID] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [largeAvatarUrl, setLargeAvatarUrl] = useState('');
  const [isHover, setIsHover] = useState(false);
  const uploadRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    async function getData() {
      const userData = await fetch(
        `https://api.intra.42.fr/v2/me?access_token=${session.access_token}`,
        {
          cache: 'no-store',
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
      ).then((res) => (res.ok ? res.json() : signOut()));
      setIntraID(userData.login);
      setAvatarUrl(userData.image.versions.small);
      setLargeAvatarUrl(userData.image.versions.large);
    }

    getData();
  }, []);

  async function uploadAvatar(avatarFile: File | undefined): Promise<void> {
    if (avatarFile) {
      const formData = new FormData();

      formData.set('avatarFile', avatarFile);
      formData.set('intraID', intraID);
      formData.set('oldAvatarPath', avatarUrl);

      const res = await fetch('/api/upload-avatar', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const body = await res.json();

        setAvatarUrl(body['path']);
        setLargeAvatarUrl(body['path']);
      } else {
        console.log(await res.text());
      }
    }
  }

  return (
    <Box
      width='60vw'
      height='70vh'
      display='flex'
      flexDirection='column'
      justifyContent='space-evenly'
    >
      <Slide direction='down' in timeout={2500}>
        <Typography variant='h1' align='center'>
          Welcome, {session.user?.name}
        </Typography>
      </Slide>
      <Grow in={avatarUrl.length > 0} timeout={2500}>
        <Box
          alignSelf='center'
          onMouseOver={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          onClick={() => uploadRef && uploadRef.current?.click()}
        >
          <input
            hidden
            type='file'
            ref={uploadRef}
            onChange={(event) => uploadAvatar(event.target.files?.[0])}
          />
          <Avatar
            src={largeAvatarUrl}
            sx={{
              width: 250,
              height: 250,
              opacity: isHover ? 0.5 : 1,
              transition: 'opacity 0.25s',
            }}
          />
        </Box>
      </Grow>
      <Slide direction='up' in timeout={2500}>
        <TextField
          sx={{
            maxWidth: '30vw',
            marginLeft: '15vw',
          }}
          autoComplete='off'
          label='Username'
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              signUp(username, session.refresh_token, avatarUrl).then(
                (newUser) => setCurrentUser(newUser),
              );
            }
          }}
        />
      </Slide>
    </Box>
  );
}
