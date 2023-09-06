'use client';
import { Session } from 'next-auth';
import { useRef, useState } from 'react';
import { Avatar, Box, Grow, Slide, Typography } from '@mui/material';
import InputField from '../utils/InputField';
import NotificationBar from '../utils/NotificationBar';
import uploadAvatar from '@/lib/uploadAvatar';
import signUp from '@/lib/signUp';
import { useUserActions } from '@/lib/stores/useUserStore';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';
import { User } from '@/types/UserTypes';
import { Preference } from '@/types/PreferenceTypes';

interface FirstTimeSetupProps {
  session: Session;
}

export default function FirstTimeSetup({ session }: FirstTimeSetupProps) {
  const { setNewUser } = useUserActions();
  const { displayNotification } = useNotificationActions();
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(session.avatarUrl);
  const [largeAvatarUrl, setLargeAvatarUrl] = useState(session.largeAvatarUrl);
  const [isHover, setIsHover] = useState(false);
  const uploadRef = useRef<HTMLInputElement | null>(null);

  async function handleAvatarUpload(
    avatarFile: File | undefined,
  ): Promise<void> {
    if (avatarFile) {
      const res = await uploadAvatar(avatarFile, session.intraID, avatarUrl);

      if (res.status === 200) {
        setAvatarUrl(res.body['path']);
        setLargeAvatarUrl(res.body['path']);
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
        <Typography
          sx={{
            textShadow: '4px 4px 6px black',
          }}
          fontFamily='cyberfont'
          letterSpacing='1rem'
          color='#DDDDDD'
          variant='h1'
          align='center'
        >
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
            onChange={(event) => handleAvatarUpload(event.target.files?.[0])}
            onClick={(event) => event.stopPropagation()}
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
        <Box maxWidth='30vw' marginLeft='15vw'>
          <InputField
            outlined
            invertColors
            handleEnterInput
            label='Username'
            value={username}
            onChange={setUsername}
            onSubmit={() =>
              signUp(session.intraID, username, session.refreshToken, avatarUrl)
                .then(
                  ({
                    newUser,
                    preference,
                  }: {
                    newUser: User;
                    preference: Preference;
                  }) => setNewUser(newUser, preference),
                )
                .catch((error) => displayNotification('error', error))
            }
          />
        </Box>
      </Slide>
      <NotificationBar />
    </Box>
  );
}
