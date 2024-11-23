'use client';

import { motion } from 'framer-motion';
import { Book, User, Sparkles } from 'lucide-react';

const icons = {
  Book,
  User,
  Sparkles
};

interface QuickStartStep {
  title: string;
  description: string;
  icon: keyof typeof icons;
}

export function QuickStartGuide({ steps }: { steps: QuickStartStep[] }) {
  return (
    <section className="px-4 py-6">
      <h3 className="text-lg font-semibold text-white mb-6">시작하기</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((step, idx) => {
          const Icon = icons[step.icon];
          
          return (
            <motion.div
              key={idx}
              className="bg-gray-800/30 backdrop-blur p-6 rounded-lg border border-purple-500/20
                         hover:border-purple-500/40 transition-colors cursor-pointer"
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full bg-purple-500/20">
                  <Icon className="text-purple-300" size={24} />
                </div>
                <h4 className="text-white font-semibold">{step.title}</h4>
              </div>
              <p className="text-gray-400 text-sm">{step.description}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
} 