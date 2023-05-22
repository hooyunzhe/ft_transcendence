import { getIronSession } from 'iron-session/edge';
import { NextRequest, NextResponse } from 'next/server';
// import { getSession } from './lib/session';

const sessionOptions = {
  password: 'complex_password_at_least_32_characters_long',
  cookieName: 'user-session',
};

export async function middleware(req: NextRequest) {
  console.log('HELLO FROM MIDDLEWARE!');

  const res = NextResponse.next();

  // const session = await getSession(req, res);
  const session = await getIronSession(req, res, sessionOptions);
  console.log('from middleware: ');
  console.log(session);

  if (
    !session.user &&
    req.nextUrl.pathname !== '/login' &&
    req.nextUrl.pathname !== '/42_oauth'
  ) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
