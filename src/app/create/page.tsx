'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Plus, ArrowRight, Wand2, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { BackButton } from '@/components/common/BackButton';
import { QuickStartSteps } from '@/components/create/QuickStartSteps';
import { CharacterModel } from '@/types';
import { useStoryStore } from '@/store/storyStore';

const genres = [
  {
    id: 'regression',
    title: '회귀물',
    description: '과거로 돌아가 인생을 다시 시작하는 이야기',
    icon: '⏰',
    examples: ['회귀자의 게임', '두번째 기회에서'],
  },
  {
    id: 'mukhyub',
    title: '무협',
    description: '무공과 협객들의 세계를 다룬 이야기',
    icon: '⚔️',
    examples: ['검신의 귀환', '무림최강 신입문주'],
  },
  {
    id: 'rofan',
    title: '로맨스 판타지',
    description: '판타지 세계관의 로맨스 스토리',
    icon: '👑',
    examples: ['황녀의 재혼', '빌런 영애 생존기'],
  },
  {
    id: 'modern',
    title: '현대판타지',
    description: '현실 세계에서 벌어지는 초자연적 이야기',
    icon: '🌆',
    examples: ['던전 속 사회생활', '서울역 헌터'],
  },
  {
    id: 'munchkin',
    title: '먼치킨',
    description: '압도적인 성장과 전개의 이야기',
    icon: '💪',
    examples: ['최강자의 귀환', 'SSS급 성장'],
  },
  {
    id: 'academy',
    title: '학원물',
    description: '학교를 배경으로 한 성장 스토리',
    icon: '🎓',
    examples: ['천재의 수련일기', '마법학교 F급 신입생'],
  },
  {
    id: 'game',
    title: '게임판타지',
    description: '게임 같은 세계관의 이야기',
    icon: '🎮',
    examples: ['레벨업 하는 회사원', '시작부터 9999렙'],
  },
  {
    id: 'reincarnation',
    title: '환생/빙의',
    description: '다른 세계의 몸에 빙의하는 이야기',
    icon: '✨',
    examples: ['빌런의 몸으로 환생했다', '공녀로 살아남기'],
  },
];

export default function CreatePage() {
  const [characters, setCharacters] = useState<CharacterModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { selectedCharacter, selectedGenre, setCharacter, setGenre, reset } = useStoryStore();
  const genreSectionRef = useRef<HTMLElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      const response = await fetch('/api/characters');
      if (!response.ok) throw new Error('캐릭터 목록을 불러오는데 실패했습니다.');
      const data = await response.json();
      setCharacters(data);
    } catch (error) {
      console.error('캐릭터 로딩 에러:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (selectedCharacter && selectedGenre) {
      router.push(`/write/ai`);
    }
  };

  const handleCharacterSelect = (character: CharacterModel) => {
    setCharacter(character);
    genreSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleGenreSelect = (genreTitle: string) => {
    setGenre(genreTitle);
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <BackButton href="/" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-8">나만의 이야기 만들기</h1>

        <QuickStartSteps className="mb-12" />

        {/* 캐릭터 선택 섹션 */}
        <section className="mb-24">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <User className="text-purple-400" size={24} />
            주인공 선택
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="bg-gray-800/30 h-48 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : characters.length === 0 ? (
            <div className="bg-gray-800/30 backdrop-blur p-6 rounded-lg border border-purple-500/20 text-center">
              <p className="text-gray-400 mb-4">아직 생성한 캐릭터가 없습니다</p>
              <button
                onClick={() => router.push('/create/character')}
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Plus size={20} />
                새로운 캐릭터 만들기
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {characters.map((character) => (
                <motion.div
                  key={character.id}
                  whileHover={{ scale: 1.02 }}
                  className={`relative bg-gray-800/30 backdrop-blur p-6 rounded-lg border cursor-pointer transition-all ${
                    selectedCharacter?.id === character.id
                      ? 'border-purple-500'
                      : 'border-purple-500/20 hover:border-purple-500/50'
                  }`}
                  onClick={() => handleCharacterSelect(character)}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 ${
                        character.gender === '남성' ? 'border-blue-500' : 'border-pink-500'
                      }`}
                    >
                      {character.profileImage ? (
                        <Image src={character.profileImage} alt={character.name} fill className="object-cover" />
                      ) : (
                        <div
                          className={`w-full h-full flex items-center justify-center ${
                            character.gender === '남성' ? 'bg-blue-500/20' : 'bg-pink-500/20'
                          }`}
                        >
                          <User
                            className={`${character.gender === '남성' ? 'text-blue-400' : 'text-pink-400'}`}
                            size={24}
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white mb-1">{character.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            character.gender === '남성'
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-pink-500/20 text-pink-300'
                          }`}
                        >
                          {character.gender}
                        </span>
                        <span className="text-sm text-gray-400">{character.age}세</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {Object.entries(character.stats)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 3)
                      .map(([stat, value]) => (
                        <div key={stat} className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 w-16">
                            {
                              {
                                appearance: '외모',
                                charisma: '카리스마',
                                speech: '말빨',
                                luck: '운',
                                wit: '재치',
                              }[stat]
                            }
                          </span>
                          <div className="flex-grow h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${value}%` }}
                              transition={{ duration: 0.5 }}
                              className={`h-full bg-gradient-to-r ${
                                value >= 80
                                  ? 'from-amber-500 to-yellow-300'
                                  : value >= 60
                                  ? 'from-green-500 to-emerald-300'
                                  : value >= 40
                                  ? 'from-blue-500 to-cyan-300'
                                  : 'from-purple-500 to-pink-300'
                              }`}
                            />
                          </div>
                          <span className="text-xs text-gray-400 w-8 text-right">{value}</span>
                        </div>
                      ))}
                  </div>

                  {character.personality && (
                    <div className="flex flex-wrap gap-1">
                      {character.personality
                        .split(',')
                        .slice(0, 2)
                        .map((tag, idx) => (
                          <span key={idx} className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full">
                            #{tag.trim()}
                          </span>
                        ))}
                    </div>
                  )}

                  {selectedCharacter?.id === character.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                    >
                      <Check className="text-white" size={14} />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* 장르 선택 섹션 */}
        {
          <motion.section
            ref={genreSectionRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-24 scroll-mt-8"
          >
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Wand2 className="text-amber-400" size={24} />
              장르 선택
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {genres.map((genre) => (
                <motion.div
                  key={genre.id}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-gray-800/30 backdrop-blur p-6 rounded-lg border cursor-pointer ${
                    selectedGenre === genre.id ? 'border-amber-500' : 'border-purple-500/20 hover:border-purple-500/50'
                  }`}
                  onClick={() => handleGenreSelect(genre.title)}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">{genre.icon}</span>
                    <div>
                      <h3 className="text-lg font-medium text-white mb-1">{genre.title}</h3>
                      <p className="text-sm text-gray-400 mb-2">{genre.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {genre.examples.map((example, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        }

        {/* 다음 단계 버튼 */}
        <div ref={bottomRef}>
          <AnimatePresence>
            {selectedCharacter && selectedGenre && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-end"
              >
                <button
                  onClick={handleContinue}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-amber-500 text-white px-6 py-2 rounded-lg font-medium shadow-lg"
                >
                  다음 단계
                  <ArrowRight size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
