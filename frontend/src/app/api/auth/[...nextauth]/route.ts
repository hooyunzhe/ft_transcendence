import NextAuth, { NextAuthOptions } from 'next-auth';
import FortyTwoProvider from 'next-auth/providers/42-school';

export const authOptions: NextAuthOptions = {
  providers: [
    FortyTwoProvider({
      clientId: process.env.FT_OAUTH_UID ?? '',
      clientSecret: process.env.FT_OAUTH_SECRET ?? '',
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.intraID = profile.login;
        token.accessToken = account.access_token ?? '';
        token.refreshToken = account.refresh_token ?? '';
      }
      return token;
    },
    async session({ session, token }) {
      session.intraID = token.intraID;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
