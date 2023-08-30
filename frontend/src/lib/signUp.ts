import callAPI from './callAPI';
import { User } from '@/types/UserTypes';
import { Preference } from '@/types/PreferenceTypes';

export default async function signUp(
  intraID: string,
  username: string,
  refreshToken: string,
  avatarUrl: string,
): Promise<{
  newUser: User;
  preference: Preference;
}> {
  if (username.length > 16) {
    throw 'Username cannot be more than 16 characters long';
  }

  const userResponse = await callAPI('POST', 'users', {
    intra_id: intraID,
    username: username,
    refresh_token: refreshToken,
    avatar_url: avatarUrl,
  });
  if (userResponse.status === 201) {
    const newUser = userResponse.body;
    const preference = await callAPI('POST', 'preferences', {
      user_id: newUser.id,
    }).then((res) => res.body);

    if (preference) {
      const statistic = await callAPI('POST', 'statistics', {
        user_id: newUser.id,
      }).then((res) => res.body);

      if (statistic) {
        return { newUser: newUser, preference: preference };
      } else {
        throw 'FATAL ERROR: FAILED TO CREATE STATISTIC IN BACKEND';
      }
    } else {
      throw 'FATAL ERROR: FAILED TO CREATE PREFERENCE IN BACKEND';
    }
  } else if (userResponse.status === 400) {
    throw 'Username already taken';
  } else {
    throw 'FATAL ERROR: FAILED TO CREATE NEW USER IN BACKEND';
  }
}
