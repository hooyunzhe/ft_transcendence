'use client';
import { useRef, useState } from 'react';
import { Avatar, Box } from '@mui/material';
import uploadAvatar from '@/lib/uploadAvatar';
import callAPI from '@/lib/callAPI';
import { useCurrentUser, useUserActions } from '@/lib/stores/useUserStore';
import { useTwoFactorActions } from '@/lib/stores/useTwoFactorStore';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';

export default function SettingsAvatarSegment() {
  const currentUser = useCurrentUser();
  const { changeCurrentUserAvatar } = useUserActions();
  const { displayTwoFactor } = useTwoFactorActions();
  const { displayNotification } = useNotificationActions();
  const [isHover, setIsHover] = useState(false);
  const uploadRef = useRef<HTMLInputElement | null>(null);

  async function handleAvatarUpload(
    avatarFile: File | undefined,
  ): Promise<void> {
    if (avatarFile) {
      const res = await uploadAvatar(
        avatarFile,
        currentUser.intra_id,
        currentUser.avatar_url,
      );

      if (res.status === 200) {
        await callAPI('PATCH', 'users', {
          id: currentUser.id,
          avatar_url: res.body['path'],
        });
        changeCurrentUserAvatar(res.body['path']);
        displayNotification('success', 'Avatar changed, refreshing...');
        location.reload();
      }
    }
  }

  return (
    <Box
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={() =>
        displayTwoFactor(() => uploadRef && uploadRef.current?.click())
      }
    >
      <input
        hidden
        type='file'
        ref={uploadRef}
        onChange={(event) => handleAvatarUpload(event.target.files?.[0])}
        onClick={(event) => event.stopPropagation()}
      />
      <Avatar
        src={currentUser.avatar_url}
        alt={currentUser.username}
        sx={{
          width: '125px',
          height: '125px',
          border: 'solid 1px black',
          opacity: isHover ? 0.5 : 1,
          transtion: 'opacity 0.25s',
        }}
      />
    </Box>
  );
}
