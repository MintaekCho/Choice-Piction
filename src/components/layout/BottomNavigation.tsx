'use client';

import { Star, Search, Clock, Menu } from 'lucide-react';
import { useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { icon: Star, label: '홈', path: '/' },
  { icon: Search, label: '탐색', path: '/explore' },
  { icon: Clock, label: '투표', path: '/votes' },
  { icon: Menu, label: '메뉴', path: '/menu' }
];

export function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = useCallback((path: string) => {
    router.push(path);
  }, [router]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md border-t border-purple-500/20">
      <div className="grid grid-cols-4 gap-1 px-2 py-3">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className="flex flex-col items-center gap-1"
          >
            <item.icon 
              size={20} 
              className={pathname === item.path ? "text-white" : "text-gray-400"} 
            />
            <span className="text-xs text-gray-300">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
} 