'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

export function HeaderActions() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (!session) {
    return (
      <button
        onClick={() => router.push('/login')}
        className="flex items-center gap-2 text-white hover:text-purple-400 transition-colors"
      >
        <User size={20} />
        <span className="text-sm">로그인</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-white text-sm">{session.user.username}</div>
      <button
        onClick={() => signOut()}
        className="text-gray-400 hover:text-white transition-colors"
      >
        <LogOut size={20} />
      </button>
    </div>
  );
} 