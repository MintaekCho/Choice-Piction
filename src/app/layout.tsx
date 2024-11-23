import './globals.css';
import { Inter } from 'next/font/google';
import ClientProvider from '@/components/providers/ClientProvider';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="ko">
      <body className={inter.className}>
        <ClientProvider session={session}>
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}
