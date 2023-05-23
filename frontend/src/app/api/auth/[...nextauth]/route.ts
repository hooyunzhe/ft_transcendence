import NextAuth, { Account, NextAuthOptions, Profile } from 'next-auth';
import { JWT } from 'next-auth/jwt';
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
      // console.log(token);
      // console.log('----------------');
      // console.log(account);
      if (token && account && profile) {
        token.refresh_token = account.refresh_token;
        token.image = profile.image;
      }
      return token;
    },
    async session({ session, token, user }) {
      // if (session?) {
      //   session.refresh_token = token.refresh_token;
      //   session.image = token.image;
      // }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
