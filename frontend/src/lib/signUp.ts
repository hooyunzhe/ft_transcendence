import { User } from '@/types/UserTypes';

export default async function signUp(
  intraID: string,
  username: string,
  refreshToken: string,
  avatarUrl: string,
): Promise<User> {
  if (username.length > 16) {
    throw 'Username cannot be more than 16 characters long';
  }

  const newUser = await fetch(
    process.env.NEXT_PUBLIC_HOST_URL + ':4242/api/users',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intra_id: intraID,
        username: username,
        refresh_token: refreshToken,
        avatar_url: avatarUrl,
      }),
    },
  ).then((res) => {
    if (res.status === 400) {
      throw 'Username already taken';
    } else {
      return res.json();
    }
  });

  await fetch(process.env.NEXT_PUBLIC_HOST_URL + ':4242/api/statistics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: newUser.id,
    }),
  }).catch((error) => console.log(error));

  return newUser;
}
