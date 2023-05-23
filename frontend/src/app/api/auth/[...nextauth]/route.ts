import NextAuth, { NextAuthOptions } from 'next-auth';
import FortyTwoProvider from 'next-auth/providers/42-school';

export const authOptions: NextAuthOptions = {
  providers: [
    FortyTwoProvider({
      clientId: process.env.FT_OAUTH_UID ?? '',
      clientSecret: process.env.FT_OAUTH_SECRET ?? '',
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
