import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { User } from './user';

declare module 'next-auth/jwt' {
  interface JWT {
    access_token: string;
    refresh_token: string;
  }
}

declare module 'next-auth' {
  interface Session {
    user: User;
    access_token: string;
    refresh_token: string;
    expires: Date;
  }
}
