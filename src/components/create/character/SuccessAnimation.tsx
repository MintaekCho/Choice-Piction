'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles } from 'lucide-react';

interface SuccessAnimationProps {
  characterName: string;
  onComplete: () => void;
}

export function SuccessAnimation({ characterName, onComplete }: SuccessAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onComplete}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring",
          duration: 0.5,
          delay: 0.2
        }}
        className="bg-gradient-to-r from-purple-900/90 to-amber-900/90 p-8 rounded-2xl border border-purple-500/20 max-w-sm mx-4 text-center relative overflow-hidden"
      >
        {/* 배경 효과 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 2 }}
            transition={{ duration: 1 }}
            className="w-full h-full bg-gradient-to-r from-purple-500/10 to-amber-500/10 rounded-full blur-3xl"
          />
        </div>

        {/* 성공 아이콘 */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            duration: 0.5,
            delay: 0.3
          }}
          className="relative mb-6"
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-amber-500 rounded-full flex items-center justify-center">
            <CheckCircle2 className="text-white" size={40} />
          </div>
          {/* 반짝이는 효과 */}
          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="absolute top-0 left-1/2 -translate-x-1/2"
          >
            <Sparkles className="text-amber-400" size={24} />
          </motion.div>
        </motion.div>

        {/* 텍스트 */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-2xl font-bold text-white mb-4"
        >
          캐릭터 생성 완료!
        </motion.h2>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-purple-200 mb-6"
        >
          <span className="font-bold text-amber-400">{characterName}</span>
          <br />캐릭터가 성공적으로 생성되었습니다
        </motion.p>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          onClick={onComplete}
          className="bg-gradient-to-r from-purple-600 to-amber-500 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:opacity-90 transition-opacity"
        >
          확인
        </motion.button>
      </motion.div>
    </motion.div>
  );
} 