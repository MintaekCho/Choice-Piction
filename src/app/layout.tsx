import './globals.css';
import { Inter } from 'next/font/google';
import ClientProvider from '@/components/providers/ClientProvider';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth.config';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authConfig);

  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Suspense fallback={null}>
          <ClientProvider session={session}>
            {children}
          </ClientProvider>
        </Suspense>
      </body>
    </html>
  );
}
