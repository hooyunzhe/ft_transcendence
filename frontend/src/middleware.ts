import { withAuth } from 'next-auth/middleware';

// export async function middleware() {}

export default withAuth(
  function middleware(req) {
    // console.log(req.nextauth.token);
  },
  {
    pages: {
      signIn: '/login',
    },
  },
);

export const config = {
  matcher: '/((?!login|api|_next/static|_next/image|favicon.ico).*)',
};
