'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Heart, Crown, MessageCircle, Sparkles, Zap, Book, Sword, Shield } from 'lucide-react';
import Image from 'next/image';
import { BackButton } from '@/components/common/BackButton';
import { CharacterModel } from '@/types';
import { LucideIcon } from 'lucide-react';

export default function CharacterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [character, setCharacter] = useState<CharacterModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stats' | 'stories' | 'history'>('stats');

  useEffect(() => {
    fetchCharacter();
  }, []);

  const fetchCharacter = async () => {
    try {
      const response = await fetch(`/api/characters/${(await params).id}`);
      if (!response.ok) throw new Error('캐릭터 정보를 불러오는데 실패했습니다.');
      const data = await response.json();
      setCharacter(data);
    } catch (error) {
      console.error('캐릭터 로딩 에러:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <BackButton />
          <div className="text-center mt-12">
            <h1 className="text-2xl text-white mb-4">캐릭터를 찾을 수 없습니다</h1>
            <p className="text-gray-400">존재하지 않거나 삭제된 캐릭터입니다.</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatColor = (value: number) => {
    if (value >= 80) return 'from-amber-500 to-yellow-300';
    if (value >= 60) return 'from-green-500 to-emerald-300';
    if (value >= 40) return 'from-blue-500 to-cyan-300';
    return 'from-purple-500 to-pink-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <BackButton className="mb-8" />
        
        {/* 캐릭터 프로필 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/30 backdrop-blur rounded-xl border border-purple-500/20 overflow-hidden mb-8"
        >
          {/* 헤더 배경 */}
          <div className="relative h-48">
            {/* 그라데이션 배경 */}
            <div className={`absolute inset-0 ${
              character.gender === '남성'
                ? 'bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20'
                : 'bg-gradient-to-r from-pink-600/20 via-purple-600/20 to-pink-600/20'
            }`}>
              {/* 장식용 패턴 */}
              <div className="absolute inset-0 opacity-10">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-24 h-24 rounded-full ${
                      character.gender === '남성' ? 'bg-blue-500' : 'bg-pink-500'
                    }`}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      transform: 'translate(-50%, -50%)',
                      filter: 'blur(40px)'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* 프로필 정보 */}
            <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end gap-6">
              {/* 프로필 이미지 */}
              <div className={`relative w-32 h-32 rounded-2xl overflow-hidden border-4 flex-shrink-0 ${
                character.gender === '남성'
                  ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                  : 'border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]'
              }`}>
                {character.profileImage ? (
                  <Image
                    src={character.profileImage}
                    alt={character.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${
                    character.gender === '남성'
                      ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/20'
                      : 'bg-gradient-to-br from-pink-500/20 to-pink-600/20'
                  }`}>
                    {character.gender === '남성' ? (
                      <User className="text-blue-400" size={48} />
                    ) : (
                      <Heart className="text-pink-400" size={48} />
                    )}
                  </div>
                )}
              </div>

              {/* 캐릭터 정보 */}
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-white">{character.name}</h1>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    character.gender === '남성'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                  }`}>
                    {character.gender}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-gray-400">
                    {character.age}세
                  </p>
                  {character.personality && (
                    <div className="flex gap-2">
                      {character.personality.split(',').slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-sm px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full"
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className="mt-4 px-8">
            <div className="flex gap-4 border-b border-gray-700">
              {[
                { id: 'stats', label: '능력치', icon: Shield },
                { id: 'stories', label: '스토리', icon: Book },
                { id: 'history', label: '히스토리', icon: Sword }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'stats' | 'stories' | 'history')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors relative ${
                    activeTab === tab.id ? 'text-white' : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-amber-500"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 탭 컨텐츠 */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'stats' && (
                <motion.div
                  key="stats"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* 능력치 그래프 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(character.stats).map(([stat, value]) => (
                      <div key={stat} className="bg-gray-700/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {(() => {
                              const Icon: LucideIcon = {
                                appearance: User,
                                charisma: Crown,
                                speech: MessageCircle,
                                luck: Sparkles,
                                wit: Zap
                              }[stat];
                              return <Icon className="text-purple-400" size={16} />;
                            })()}
                            <span className="text-gray-300">{
                              {
                                appearance: '외모',
                                charisma: '카리스마',
                                speech: '말빨',
                                luck: '운',
                                wit: '재치'
                              }[stat]
                            }</span>
                          </div>
                          <span className="text-white font-bold">{value}</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${value}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full bg-gradient-to-r ${getStatColor(value)}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 성격 태 */}
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                      <Crown className="text-amber-400" size={16} />
                      성격
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {character.personality.split(',').map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 배경 스토리 */}
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                      <Book className="text-blue-400" size={16} />
                      배경 스토리
                    </h3>
                    <p className="text-gray-300 whitespace-pre-wrap">
                      {character.background}
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'stories' && (
                <motion.div
                  key="stories"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="text-center py-8">
                    <Book className="mx-auto text-gray-500 mb-2" size={48} />
                    <p className="text-gray-400">아직 참여한 스토리가 없습니다</p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'history' && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="text-center py-8">
                    <Sword className="mx-auto text-gray-500 mb-2" size={48} />
                    <p className="text-gray-400">아직 활동 내역이 없습니다</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 