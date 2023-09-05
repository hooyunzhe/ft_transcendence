import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Cyberpong',
  description: 'Not an ordinary Pong',
  viewport: 'initial-scale=1, width=device-width',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body
        className={inter.className}
        style={{ margin: '0px', overflow: 'hidden' }}
      >
        {children}
      </body>
    </html>
  );
}
