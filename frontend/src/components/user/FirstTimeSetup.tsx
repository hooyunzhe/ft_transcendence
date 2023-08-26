'use client';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { Avatar, Box, Grow, Slide, Typography } from '@mui/material';
import InputField from '../utils/InputField';
import NotificationBar from '../utils/NotificationBar';
import signUp from '@/lib/signUp';
import { useUserActions } from '@/lib/stores/useUserStore';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';

interface FirstTimeSetupProps {
  session: Session;
}

export default function FirstTimeSetup({ session }: FirstTimeSetupProps) {
  const { setCurrentUser } = useUserActions();
  const { displayNotification } = useNotificationActions();
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [largeAvatarUrl, setLargeAvatarUrl] = useState('');
  const [isHover, setIsHover] = useState(false);
  const uploadRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    async function getData() {
      const userData = await fetch(
        `https://api.intra.42.fr/v2/me?access_token=${session.accessToken}`,
        {
          cache: 'no-store',
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
      ).then((res) => (res.ok ? res.json() : signOut()));
      setAvatarUrl(userData.image.versions.small);
      setLargeAvatarUrl(userData.image.versions.large);
    }

    getData();
  }, []);

  async function uploadAvatar(avatarFile: File | undefined): Promise<void> {
    if (avatarFile) {
      const formData = new FormData();

      formData.set('avatarFile', avatarFile);
      formData.set('intraID', session.intraID);
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
              border: 'solid 1px black',
              opacity: isHover ? 0.5 : 1,
              transition: 'opacity 0.25s',
            }}
          />
        </Box>
      </Grow>
      <Slide direction='up' in timeout={2500}>
        <Box
          maxWidth='30vw'
          marginLeft='15vw'
          padding='1vh'
          border='solid 3px #363636'
          borderRadius='15px'
          bgcolor='#4CC9F090'
        >
          <InputField
            outlined
            label='Username'
            value={username}
            onChange={setUsername}
            onSubmit={() =>
              signUp(session.intraID, username, session.refreshToken, avatarUrl)
                .then((newUser) => setCurrentUser(newUser))
                .catch((error) => {
                  displayNotification('error', error);
                })
            }
          />
        </Box>
      </Slide>
      <NotificationBar />
    </Box>
  );
}
