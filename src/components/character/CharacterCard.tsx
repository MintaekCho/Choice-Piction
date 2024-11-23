'use client';

import { motion } from 'framer-motion';
import { User, Heart, Crown, MessageCircle, Sparkles, Zap } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Character } from '@/types';

interface CharacterCardProps {
  character: Character;
}

export function CharacterCard({ character }: CharacterCardProps) {
  const router = useRouter();

  const getTopStats = () => {
    return Object.entries(character.stats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
  };

  const getStatIcon = (stat: string) => {
    const icons = {
      appearance: User,
      charisma: Crown,
      speech: MessageCircle,
      luck: Sparkles,
      wit: Zap
    };
    return icons[stat as keyof typeof icons] || User;
  };

  const getStatColor = (stat: string) => {
    const colors = {
      appearance: 'pink',
      charisma: 'amber',
      speech: 'blue',
      luck: 'purple',
      wit: 'green'
    };
    return colors[stat as keyof typeof colors] || 'gray';
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-gray-800/30 backdrop-blur rounded-lg border border-purple-500/20 overflow-hidden cursor-pointer group"
      onClick={() => router.push(`/characters/${character.id}`)}
    >
      <div className="p-4">
        {/* 캐릭터 기본 정보 */}
        <div className="flex items-center gap-4 mb-4">
          <div className={`relative w-16 h-16 rounded-full overflow-hidden ${
            character.gender === '남성' 
              ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-2 border-blue-500/30' 
              : 'bg-gradient-to-br from-pink-500/20 to-purple-600/20 border-2 border-pink-500/30'
          }`}>
            {character.profileImage ? (
              <Image
                src={character.profileImage}
                alt={character.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {character.gender === '남성' ? (
                  <User className="text-blue-400" size={32} />
                ) : (
                  <Heart className="text-pink-400" size={32} />
                )}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
              {character.name}
            </h3>
            <p className="text-sm text-gray-400">
              {character.gender} · {character.age}세
            </p>
          </div>
        </div>

        {/* 주요 능력치 */}
        <div className="space-y-2">
          {getTopStats().map(([stat, value]) => {
            const StatIcon = getStatIcon(stat);
            const color = getStatColor(stat);
            
            return (
              <div key={stat} className="flex items-center gap-2">
                <StatIcon className={`text-${color}-400`} size={14} />
                <div className="flex-1 h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    className={`h-full bg-gradient-to-r from-${color}-600 to-${color}-400`}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className={`text-xs text-${color}-400`}>{value}</span>
              </div>
            );
          })}
        </div>

        {/* 성격 태그 */}
        {character.personality && (
          <div className="mt-4 flex flex-wrap gap-1">
            {character.personality.split(',').slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full"
              >
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
} 