import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { User } from './types/UserTypes';

declare module 'next-auth/jwt' {
  interface JWT {
    intraID: string;
    accessToken: string;
    refreshToken: string;
  }
}

declare module 'next-auth' {
  interface Profile {
    login: string;
  }

  interface Session {
    intraID: string;
    accessToken: string;
    refreshToken: string;
    expires: Date;
  }
}
