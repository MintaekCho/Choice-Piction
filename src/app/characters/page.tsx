'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Character } from '@/types';
import { CharacterCard } from '@/components/character/CharacterCard';
import { BackButton } from '@/components/common/BackButton';

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

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

  const filteredCharacters = characters.filter(character => 
    character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    character.personality?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <BackButton />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Users className="text-purple-400" />
            내 캐릭터
          </h1>
          <p className="text-gray-400">
            생성한 캐릭터들을 관리하고 새로운 이야기의 주인공으로 선택하세요
          </p>
        </motion.div>

        {/* 검색 및 필터 영역 */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="캐릭터 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800/50 text-white px-4 py-2 pl-10 rounded-lg border border-purple-500/20 focus:border-purple-500/50 focus:outline-none"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <button
            onClick={() => router.push('/create/character')}
            className="bg-gradient-to-r from-purple-600 to-amber-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            새 캐릭터
          </button>
        </div>

        {/* 캐릭터 그리드 */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="bg-gray-800/30 rounded-lg h-48 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <AnimatePresence>
            {filteredCharacters.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCharacters.map((character, idx) => (
                  <motion.div
                    key={character.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <CharacterCard character={character} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-gray-400 mb-4">
                  {searchTerm ? '검색 결과가 없습니다.' : '아직 생성한 캐릭터가 없습니다.'}
                </p>
                <button
                  onClick={() => router.push('/create/character')}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  첫 캐릭터 만들러 가기
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
} 