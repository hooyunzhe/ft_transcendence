import { APIResponse } from '@/types/UtilTypes';

export default async function uploadAvatar(
  avatarFile: File,
  intraID: string,
  oldAvatarPath: string,
): Promise<APIResponse> {
  const formData = new FormData();

  formData.set('avatarFile', avatarFile);
  formData.set('intraID', intraID);
  formData.set('oldAvatarPath', oldAvatarPath);

  const res = await fetch('/api/upload-avatar', {
    method: 'POST',
    body: formData,
  });

  return {
    status: res.status,
    body: await res.json(),
  };
}
