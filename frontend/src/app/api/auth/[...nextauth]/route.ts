import NextAuth, { NextAuthOptions } from 'next-auth';
import FortyTwoProvider from 'next-auth/providers/42-school';

const authOptions: NextAuthOptions = {
  providers: [
    FortyTwoProvider({
      clientId: process.env.FT_OAUTH_UID ?? '',
      clientSecret: process.env.FT_OAUTH_SECRET ?? '',
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        // The following is needed due to Next Auth's 42 School Provider doesn't have the updated types for profile.image
        type fortyTwoAPIImageType = {
          versions: {
            large: string;
            medium: string;
            small: string;
            micro: string;
          };
        };
        const fortyTwoAPIImage =
          profile.image as unknown as fortyTwoAPIImageType;

        token.intraID = profile.login;
        token.avatarUrl = fortyTwoAPIImage.versions.small;
        token.largeAvatarUrl = fortyTwoAPIImage.versions.large;
        token.accessToken = account.access_token ?? '';
        token.refreshToken = account.refresh_token ?? '';
      }
      return token;
    },
    async session({ session, token }) {
      session.intraID = token.intraID;
      session.avatarUrl = token.avatarUrl;
      session.largeAvatarUrl = token.largeAvatarUrl;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
