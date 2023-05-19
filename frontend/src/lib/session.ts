import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const sessionOptions = {
  password: 'complex_password_at_least_32_characters_long',
  cookieName: 'user-session',
};

export async function loginHandler(req: NextApiRequest, res: NextApiResponse) {
  req.session.user = { id: 1, username: 'test' };
  await req.session.save();
  res.send({ ok: true });
}

export async function userHandler(req: NextApiRequest, res: NextApiResponse) {
  res.send({ user: req.session.user });
}

export function withSession(handler: NextApiHandler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: number;
      username: string;
    };
  }
}
