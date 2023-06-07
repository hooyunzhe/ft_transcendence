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
        token.access_token = account.access_token ?? '';
        token.refresh_token = account.refresh_token ?? '';
      }
      return token;
    },
    async session({ session, token }) {
      session.user = await fetch(
        'http://localhost:4242/api/users/token/' + token.refresh_token,
        {
          method: 'GET',
        },
      )
        .then((res) => res.text())
        .then((text) => (text.length ? JSON.parse(text) : null))
        .catch((error) => console.log(error));
      session.access_token = token.access_token;
      session.refresh_token = token.refresh_token;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
