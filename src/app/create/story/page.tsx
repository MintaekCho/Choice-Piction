'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Book, Wand2, Sparkles, User, Crown, MessageCircle, Zap, LucideIcon } from 'lucide-react';
import { BackButton } from '@/components/common/BackButton';

interface Character {
  name: string;
  gender: string;
  age: number;
  personality?: string;
  stats: {
    appearance: number;
    charisma: number;
    speech: number;
    luck: number;
    wit: number;
  };
}

export default function CreateStoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [character, setCharacter] = useState<Character | null>(null);
  const [genre, setGenre] = useState<string>('');

  useEffect(() => {
    const genreParam = searchParams?.get('genre');
    const characterParam = searchParams?.get('character');

    if (!genreParam || !characterParam) {
      router.push('/create');
      return;
    }

    setGenre(genreParam);
    try {
      const parsedCharacter = JSON.parse(decodeURIComponent(characterParam));
      if (!parsedCharacter.name || !parsedCharacter.stats) {
        throw new Error('Invalid character data');
      }
      setCharacter(parsedCharacter);
    } catch (e) {
      console.error('캐릭터 정보 파싱 실패:', e);
      router.push('/create');
    }
  }, [searchParams, router]);

  if (!character || !genre) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>잠시만 기다려주세요...</p>
        </div>
      </div>
    );
  }

  const getGenreText = () => {
    switch(genre) {
      case 'fantasy': return '마법과 모험의 세계';
      case 'sf': return '미래 과학의 세계';
      case 'modern': return '현실의 세계';
      default: return '이야기의 세계';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <BackButton href="/create/character" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold text-white mb-4">
            이야기 시작하기
          </h1>
          <p className="text-gray-400">
            {character?.name}(이)가 {getGenreText()}에서 펼칠 모험
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 캐릭터 요약 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/30 backdrop-blur p-6 rounded-lg border border-purple-500/20"
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Book className="text-purple-400" size={24} />
              주인공 정보
            </h2>
            
            <div className="space-y-6">
              {/* 기본 정보 섹션 */}
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    {character.gender === '남성' ? (
                      <User className="text-white" size={32} />
                    ) : (
                      <User className="text-white" size={32} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{character?.name}</h3>
                    <p className="text-gray-400">
                      {character?.gender} · {character?.age}세
                    </p>
                  </div>
                </div>
                
                {character?.personality && (
                  <div className="text-sm text-gray-300 bg-gray-800/50 rounded-lg p-3">
                    <span className="text-purple-400 font-medium">성격: </span>
                    {character.personality}
                  </div>
                )}
              </div>

              {/* 능력치 섹션 */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3">주요 능력치</h3>
                <div className="space-y-3">
                  {character?.stats && Object.entries(character.stats)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 3)
                    .map(([stat, value]) => {
                      const statConfig = {
                        appearance: { color: 'pink', icon: User },
                        charisma: { color: 'amber', icon: Crown },
                        speech: { color: 'blue', icon: MessageCircle },
                        luck: { color: 'purple', icon: Sparkles },
                        wit: { color: 'green', icon: Zap }
                      }[stat] as { color: string; icon: LucideIcon };

                      const Icon = statConfig.icon;
                      
                      return (
                        <div key={stat} className="bg-gray-700/30 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Icon className={`text-${statConfig.color}-400`} size={16} />
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
                            <span className={`text-${statConfig.color}-400 font-bold`}>{value}</span>
                          </div>
                          <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${value}%` }}
                              className={`h-full bg-gradient-to-r from-${statConfig.color}-600 to-${statConfig.color}-400`}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        </div>
                      );
                    })
                  }
                </div>
              </div>
            </div>
          </motion.div>

          {/* 스토리 시작 옵션 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/30 backdrop-blur p-6 rounded-lg border border-purple-500/20"
          >
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Wand2 className="text-amber-400" size={20} />
              이야기 시작하기
            </h2>
            <div className="space-y-4">
              <button
                onClick={() => router.push(`/write/ai?genre=${genre}&character=${encodeURIComponent(JSON.stringify(character))}`)}
                className="w-full bg-gradient-to-r from-purple-600 to-amber-500 text-white p-4 rounded-lg flex items-center gap-3 hover:opacity-90 transition-opacity"
              >
                <Sparkles className="text-white" size={20} />
                <div className="text-left">
                  <div className="font-medium">AI와 함께 시작하기</div>
                  <div className="text-sm text-purple-200">AI가 추천하는 흥미진진한 시작</div>
                </div>
              </button>
              <button
                onClick={() => router.push(`/write/template?genre=${genre}&character=${encodeURIComponent(JSON.stringify(character))}`)}
                className="w-full bg-gray-700/50 text-white p-4 rounded-lg flex items-center gap-3 hover:bg-gray-700/70 transition-colors"
              >
                <Book className="text-purple-400" size={20} />
                <div className="text-left">
                  <div className="font-medium">템플릿으로 시작하기</div>
                  <div className="text-sm text-gray-400">검증된 템플릿으로 시작</div>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 