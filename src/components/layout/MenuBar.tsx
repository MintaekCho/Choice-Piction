'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { getMenuItems } from '@/constants/menu';
import { useSession, signOut } from 'next-auth/react';
import { Modal } from '@/components/ui/Modal';

interface MenuBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MenuBar({ isOpen, onClose }: MenuBarProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuItems, setMenuItems] = useState<Record<string, any>>({});
  const { data: session } = useSession();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (session) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [session]);

  useEffect(() => {
    setMenuItems(getMenuItems(isLoggedIn));
  }, [isLoggedIn]);

  if (!mounted) return null;

  const handleNavigation = (path: string) => {
    if (path === '/logout') {
      setShowLogoutModal(true);
      return;
    }
    router.push(path);
    onClose();
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
    setShowLogoutModal(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-gray-900 border-r border-purple-500/20 z-50"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-amber-500 bg-clip-text text-transparent">
                  Choice Fiction
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <X className="text-gray-400" size={20} />
                </button>
              </div>

              {/* Menu Items */}
              <div className="py-4 overflow-y-auto h-[calc(100vh-64px)]">
                {Object.entries(menuItems).map(([section, items]) => (
                  <div key={section} className="mb-6">
                    <div className="px-4 mb-2">
                      <h3 className="text-xs font-semibold text-gray-400 uppercase">{section}</h3>
                    </div>
                    <div className="space-y-1">
                      {items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleNavigation(item.path, item.isLogout)}
                          className="w-full px-4 py-2 flex items-center gap-3 text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors"
                        >
                          <item.icon size={18} />
                          <div className="flex flex-col items-start">
                            <span className="text-sm font-medium">{item.label}</span>
                            <span className="text-xs text-gray-500">{item.description}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="로그아웃"
        description="정말 로그아웃 하시겠습니까?"
      />
    </>
  );
}
