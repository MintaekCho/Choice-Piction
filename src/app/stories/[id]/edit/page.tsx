'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import { BackButton } from '@/components/common/BackButton';
import { toast } from 'sonner';

interface Story {
  id: string;
  title: string;
  description: string;
  genre: string[];
  status: 'DRAFT' | 'ONGOING' | 'COMPLETED';
}

const genres = [
  '판타지', 'SF', '로맨스', '무협', '현대', '미스터리'
];

const statuses = [
  { value: 'DRAFT', label: '초안' },
  { value: 'ONGOING', label: '연재중' },
  { value: 'COMPLETED', label: '완결' },
];

export default function EditStoryPage() {
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    fetchStory();
  }, []);

  const fetchStory = async () => {
    try {
      const response = await fetch(`/api/stories/${params.id}`);
      if (!response.ok) throw new Error('스토리를 불러오는데 실패했습니다.');
      const data = await response.json();
      setStory(data);
    } catch (error) {
      console.error('스토리 로딩 에러:', error);
      toast.error('스토리를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!story) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/stories/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(story),
      });

      if (!response.ok) throw new Error('스토리 수정에 실패했습니다.');
      
      toast.success('스토리가 수정되었습니다.');
      router.push(`/stories/${params.id}`);
    } catch (error) {
      console.error('스토리 수정 에러:', error);
      toast.error('스토리 수정에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <BackButton />
          <div className="text-center mt-12">
            <h1 className="text-2xl text-white mb-4">스토리를 찾을 수 없습니다</h1>
            <p className="text-gray-400">존재하지 않거나 삭제된 스토리입니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <BackButton href={`/stories/${story.id}`} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/30 backdrop-blur p-6 rounded-lg border border-purple-500/20"
        >
          <h1 className="text-2xl font-bold text-white mb-6">스토리 수정</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 제목 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                제목
              </label>
              <input
                type="text"
                value={story.title}
                onChange={(e) => setStory({ ...story, title: e.target.value })}
                className="w-full bg-gray-700/50 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* 설명 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                설명
              </label>
              <textarea
                value={story.description}
                onChange={(e) => setStory({ ...story, description: e.target.value })}
                className="w-full h-32 bg-gray-700/50 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                required
              />
            </div>

            {/* 장르 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                장르
              </label>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => {
                      const newGenres = story.genre.includes(genre)
                        ? story.genre.filter((g) => g !== genre)
                        : [...story.genre, genre];
                      setStory({ ...story, genre: newGenres });
                    }}
                    className={`px-3 py-1 rounded-full text-sm ${
                      story.genre.includes(genre)
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-700/50 text-gray-300'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* 상태 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                상태
              </label>
              <select
                value={story.status}
                onChange={(e) => setStory({ ...story, status: e.target.value as Story['status'] })}
                className="w-full bg-gray-700/50 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 버튼 */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
              >
                <Save size={18} />
                {isSaving ? '저장 중...' : '저장하기'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
} 