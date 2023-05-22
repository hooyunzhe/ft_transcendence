import { getIronSession } from 'iron-session/edge';
import { NextRequest, NextResponse } from 'next/server';

const sessionOptions = {
  password: 'complex_password_at_least_32_characters_long',
  cookieName: 'user-session',
};

// export function getSession(req: NextRequest, res: NextResponse) {
//   return getIronSession(req, res, sessionOptions);
// }

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: number;
      username: string;
    };
  }
}
