'use client';

import { motion } from 'framer-motion';
import { Zap, User, Crown, MessageCircle, Sparkles, Heart } from 'lucide-react';
import Image from 'next/image';

interface CharacterPreviewProps {
  character?: {
    name: string;
    gender: string;
    age: number;
    profileImage?: string | null;
    stats: {
      appearance: number;
      charisma: number;
      speech: number;
      luck: number;
      wit: number;
    } | string;
    background?: string;
    personality?: string;
    appearance?: string;
  };
}

export function CharacterPreview({ character }: CharacterPreviewProps) {
  const getCharacterType = (stats: NonNullable<typeof character>['stats']) => {
    const maxStat = Object.entries(stats).reduce((a, b) => 
      b[1] > a[1] ? b : a
    );

    const types = {
      appearance: "매력적인 외모형",
      charisma: "카리스마 넘치는 리더형",
      speech: "달변가형",
      luck: "행운의 주인공형",
      wit: "재치있는 전략가형"
    };

    return types[maxStat[0] as keyof typeof types];
  };
  if(typeof character?.stats === 'string') {
    return null;
  }
  return (
    <motion.div
      className="bg-gray-800/30 backdrop-blur p-6 rounded-lg border border-purple-500/20"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <h3 className="text-lg font-semibold text-white mb-4">캐릭터 미리보기</h3>
      
      {!character ? (
        <div className="aspect-square bg-gray-700/50 rounded-lg border border-purple-500/20 flex items-center justify-center">
          <p className="text-gray-400 text-sm text-center">
            캐릭터 정보를 입력하면<br />미리보기가 표시됩니다
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 기본 정보 */}
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
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
                <h4 className="text-white font-medium flex items-center gap-2">
                  {character.name}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    character.gender === '남성'
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-pink-500/20 text-pink-300'
                  }`}>
                    {character.gender}
                  </span>
                </h4>
                <p className="text-gray-400 text-sm">
                  {character.age}세
                </p>
              </div>
            </div>
          </div>

          {/* 능력치 그래프 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="text-pink-400" size={16} />
              <div className="flex-1 h-2 bg-gray-700/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-500 to-pink-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${character.stats.appearance}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-sm text-white w-8 text-right">
                {character.stats.appearance}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Crown className="text-amber-400" size={16} />
              <div className="flex-1 h-2 bg-gray-700/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${character.stats.charisma}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-sm text-white w-8 text-right">
                {character.stats.charisma}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <MessageCircle className="text-blue-400" size={16} />
              <div className="flex-1 h-2 bg-gray-700/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${character.stats.speech}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-sm text-white w-8 text-right">
                {character.stats.speech}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Sparkles className="text-purple-400" size={16} />
              <div className="flex-1 h-2 bg-gray-700/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${character.stats.luck}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-sm text-white w-8 text-right">
                {character.stats.luck}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Zap className="text-green-400" size={16} />
              <div className="flex-1 h-2 bg-gray-700/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-green-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${character.stats.wit}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-sm text-white w-8 text-right">
                {character.stats.wit}
              </span>
            </div>
          </div>

          {/* 외모 설명 섹션 */}
          {character.appearance && (
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h5 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                <User className="text-pink-400" size={16} />
                외모
              </h5>
              <p className="text-sm text-gray-400">
                {character.appearance}
              </p>
            </div>
          )}

          {/* 성격 태그 섹션 */}
          {character.personality && (
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h5 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                <Crown className="text-amber-400" size={16} />
                성격
              </h5>
              <div className="flex flex-wrap gap-2">
                {character.personality.split(',').map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 배경 서사 섹션 */}
          {character.background && (
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h5 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                <MessageCircle className="text-blue-400" size={16} />
                배경 서사
              </h5>
              <p className="text-sm text-gray-400 line-clamp-2">
                {character.background}
              </p>
            </div>
          )}

          {/* 종합 평가 */}
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <h5 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
              <Sparkles className="text-purple-400" size={16} />
              캐릭터 성향
            </h5>
            <p className="text-sm text-gray-400">
              {getCharacterType(character.stats)}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
} 