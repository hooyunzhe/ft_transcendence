import './globals.css';
import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';
import WithSessionProvider from '@/components/utils/WithSessionProvider';
import { authOptions } from './api/auth/[...nextauth]/route';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Cyberpong™',
  description: 'Not an ordinary Pong',
  viewport: 'initial-scale=1, width=device-width',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang='en'>
      <body className={inter.className}>
        <WithSessionProvider session={session}>{children}</WithSessionProvider>
      </body>
    </html>
  );
}
