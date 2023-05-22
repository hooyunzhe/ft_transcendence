// import { getSession } from '@/lib/session';
import { getIronSession } from 'iron-session/edge';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

const sessionOptions = {
  password: 'complex_password_at_least_32_characters_long',
  cookieName: 'user-session',
};

export async function GET(req: NextRequest) {
  const res = NextResponse.next();
  // const session = await getSession(req, res);
  const session = await getIronSession(req, res, sessionOptions);

  console.log('HELLO FROM API');

  session.user = { id: 1, username: 'test' };
  await session.save();
  console.log(res.cookies);
  return NextResponse.redirect(new URL('/', req.url));
  // return res;
}
