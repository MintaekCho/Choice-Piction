'use client';

import { SessionProvider } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Session } from 'next-auth';

interface ProvidersProps {
  children: React.ReactNode;
  session?: Session | null;
}

export default function ClientProvider({ children, session }: ProvidersProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
} 