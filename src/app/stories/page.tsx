'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Star, Eye, Clock, ChevronRight, Pen, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Story {
  id: string;
  title: string;
  description: string;
  genre: string[];
  status: 'DRAFT' | 'ONGOING' | 'COMPLETED';
  viewCount: number;
  likeCount: number;
  mainCharacter: {
    name: string;
    profileImage: string | null;
  };
  chapters: {
    sequence: number;
    createdAt: string;
  }[];
  updatedAt: string;
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'ongoing' | 'completed'>('all');
  const router = useRouter();

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/stories');
      if (!response.ok) throw new Error('스토리 목록을 불러오는데 실패했습니다.');
      const data = await response.json();
      setStories(data);
    } catch (error) {
      console.error('스토리 로딩 에러:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: Story['status']) => {
    switch (status) {
      case 'DRAFT': return 'text-gray-400';
      case 'ONGOING': return 'text-emerald-400';
      case 'COMPLETED': return 'text-amber-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = (status: Story['status']) => {
    switch (status) {
      case 'DRAFT': return '초안';
      case 'ONGOING': return '연재중';
      case 'COMPLETED': return '완결';
      default: return '알 수 없음';
    }
  };

  const filteredStories = stories.filter(story => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'ongoing') return story.status === 'ONGOING';
    if (activeFilter === 'completed') return story.status === 'COMPLETED';
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 헤더 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">내 스토리</h1>
          <p className="text-gray-400">당신이 만들어가는 이야기들</p>
        </motion.div>

        {/* 필터 버튼 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'all', label: '전체' },
            { id: 'ongoing', label: '연재중' },
            { id: 'completed', label: '완결' },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeFilter === filter.id
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* 새 스토리 작성 카드 */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-purple-500/20 to-amber-500/20 backdrop-blur p-6 rounded-lg border border-purple-500/20 mb-6 cursor-pointer group"
          onClick={() => router.push('/create')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Pen className="text-purple-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">새로운 이야기 시작하기</h3>
                <p className="text-gray-400 text-sm">AI와 함께 새로운 이야기를 만들어보세요</p>
              </div>
            </div>
            <ChevronRight className="text-gray-600 group-hover:text-purple-400 transition-colors" size={24} />
          </div>
        </motion.div>

        {/* 스토리 목록 */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="bg-gray-800/30 p-6 rounded-lg animate-pulse">
                <div className="h-6 bg-gray-700/50 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-700/50 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-700/50 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredStories.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Book className="text-purple-400" size={32} />
            </div>
            <h3 className="text-white font-medium mb-2">아직 작성한 스토리가 없습니다</h3>
            <p className="text-gray-400 text-sm mb-4">새로운 이야기를 시작해보세요</p>
            <button
              onClick={() => router.push('/create')}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-600 transition-colors"
            >
              스토리 만들기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredStories.map((story, idx) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group bg-gray-800/30 backdrop-blur p-6 rounded-lg border border-purple-500/20 cursor-pointer"
                  onClick={() => router.push(`/stories/${story.id}`)}
                >
                  {/* 스토리 헤더 */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-white">{story.title}</h3>
                        <span className={`text-sm ${getStatusColor(story.status)}`}>
                          {getStatusText(story.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Eye size={14} />
                          {story.viewCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star size={14} />
                          {story.likeCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {new Date(story.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="text-gray-600 group-hover:text-purple-400 transition-colors" size={24} />
                  </div>

                  {/* 장르 태그 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {story.genre.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* 주인공 정보 & 챕터 수 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                        {story.mainCharacter.profileImage ? (
                          <Image
                            src={story.mainCharacter.profileImage}
                            alt={story.mainCharacter.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        ) : (
                          <User className="text-purple-400" size={16} />
                        )}
                      </div>
                      <span className="text-sm text-gray-400">{story.mainCharacter.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Book className="text-purple-400" size={16} />
                      <span className="text-sm text-gray-400">
                        총 {story.chapters.length}화
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
} 