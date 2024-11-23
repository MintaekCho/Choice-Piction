'use client';

import { motion } from 'framer-motion';
import { User, Plus, Crown, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function CharacterSection() {
  const router = useRouter();

  return (
    <section className="px-4 mb-8">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <User className="text-purple-400" size={18} />
        나의 캐릭터
      </h3>

      {/* 캐릭터 생성 카드 */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => router.push('/create/character')}
        className="bg-gradient-to-r from-purple-900/50 to-amber-900/50 p-6 rounded-xl border border-purple-500/20 cursor-pointer group"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
            <Plus className="text-purple-300 group-hover:text-purple-200 transition-colors" size={32} />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-1">새로운 캐릭터 만들기</h4>
            <p className="text-gray-400 text-sm">당신만의 특별한 캐릭터를 만들어보세요</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-300 mb-1">
              <Crown className="text-amber-400" size={14} />
              <span>카리스마</span>
            </div>
            <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
              <div className="w-0 h-full bg-gradient-to-r from-amber-500 to-amber-400 group-hover:w-full transition-all duration-1000"></div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-300 mb-1">
              <User className="text-pink-400" size={14} />
              <span>외모</span>
            </div>
            <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
              <div className="w-0 h-full bg-gradient-to-r from-pink-500 to-pink-400 group-hover:w-full transition-all duration-1000 delay-100"></div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-300 mb-1">
              <Sparkles className="text-purple-400" size={14} />
              <span>운</span>
            </div>
            <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
              <div className="w-0 h-full bg-gradient-to-r from-purple-500 to-purple-400 group-hover:w-full transition-all duration-1000 delay-200"></div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
} 