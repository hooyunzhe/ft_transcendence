import NonSSRWrapper from '@/NonSSRWrapper';
import '../styles/cyberfont.css';
import '../styles/cyberthrone.css';

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
      <body style={{ margin: '0px', overflow: 'hidden' }}>
        <NonSSRWrapper>{children}</NonSSRWrapper>
      </body>
    </html>
  );
}
