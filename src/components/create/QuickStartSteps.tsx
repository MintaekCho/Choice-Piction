'use client';

import { motion } from 'framer-motion';
import { Book, User, Wand2, Sparkles } from 'lucide-react';

interface QuickStartStepsProps {
  className?: string;
}

const steps = [
  {
    icon: User,
    title: '캐릭터 선택',
    description: '어떤 캐릭터로 이야기를 시작할지 선택하세요',
    color: 'text-purple-400',
  },
  {
    icon: Book,
    title: '장르 선택',
    description: '당신의 이야기에 어울리는 장르를 선택하세요',
    color: 'text-amber-400',
  },

  {
    icon: Wand2,
    title: 'AI 스토리',
    description: 'AI와 함께 이야기를 만들어보세요',
    color: 'text-emerald-400',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function QuickStartSteps({ className = '' }: QuickStartStepsProps) {
  return (
    <motion.div
      className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {steps.map((step, idx) => (
        <motion.div
          key={step.title}
          variants={item}
          className="relative bg-gray-800/30 backdrop-blur p-6 rounded-lg border border-purple-500/20"
        >
          <div className="absolute -top-3 -left-3 p-3 rounded-full bg-gray-900/80 border border-purple-500/20">
            <step.icon className={`${step.color}`} size={24} />
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              {step.title}
              <span className="text-gray-400 text-sm font-normal">Step {idx + 1}</span>
            </h3>
            <p className="text-gray-400 text-sm">{step.description}</p>
          </div>

          <div className="absolute bottom-3 right-3">
            <Sparkles className="text-purple-500/20" size={20} />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
