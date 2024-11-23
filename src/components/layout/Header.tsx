'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { ChoiceFictionLogo } from '../brand/ChoiceFictionLogo';
import { HeaderActions } from './HeaderActions';
import { MenuBar } from './MenuBar';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md border-b border-purple-500/20 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            <Menu className="text-white" size={24} />
          </button>
          <ChoiceFictionLogo />
          <HeaderActions />
        </div>
      </header>

      <MenuBar 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
} 