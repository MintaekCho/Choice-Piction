'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Book, Eye, Star, Clock, Edit, ChevronRight, Trash2, Plus, Sparkles } from 'lucide-react';
import { BackButton } from '@/components/common/BackButton';
import { useSession } from 'next-auth/react';
import { Modal } from '@/components/ui/Modal';
import { toast } from 'sonner';
import { useStoryStore } from '@/store/storyStore';

interface Chapter {
  id: string;
  title: string;
  content: string;
  sequence: number;
  createdAt: string;
}

interface Story {
  id: string;
  userId: string;
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
  chapters: Chapter[];
  createdAt: string;
  updatedAt: string;
}

export default function StoryDetailPage() {
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const isAuthor = session?.user?.id === story?.userId;
  const { setChapterContext } = useStoryStore();
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

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/stories/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('스토리 삭제에 실패했습니다.');

      toast.success('스토리가 삭제되었습니다.');
      router.push('/stories');
    } catch (error) {
      console.error('스토리 삭제 에러:', error);
      toast.error('스토리 삭제에 실패했습니다.');
    }
  };

  const handleCreateNextChapter = () => {
    if (!story) return;

    const lastChapter = story.chapters.sort((a, b) => b.sequence - a.sequence)[0];

    // 마지막 챕터 정보를 StoryStore에 저장
    setChapterContext({
      currentChapter: {
        sequence: (story.chapters.length || 0) + 1,
        content: '',
      },
      previousChapter: lastChapter
        ? {
            sequence: lastChapter.sequence,
            content: lastChapter.content,
          }
        : {
            sequence: story.chapters.length,
            content: story.chapters[story.chapters.length - 1].content,
          },
      characterState: {
        name: story.mainCharacter.name,
        stats: {},
      },
    });

    router.push(`/write/editor?storyId=${story.id}&sequence=${story.chapters.length + 1}`);
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
          <BackButton href="/stories" />
        </div>

        {/* 스토리 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/30 backdrop-blur p-6 rounded-lg border border-purple-500/20 mb-8"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">{story.title}</h1>
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
            {isAuthor && (
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/stories/${story.id}/edit`)}
                  className="p-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {story.genre.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>

          <p className="text-gray-300 text-sm">{story.description}</p>
        </motion.div>

        {/* 챕터 목록 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Book className="text-purple-400" size={20} />
              챕터 목록
            </h2>
            {isAuthor && story.chapters.length > 0 && (
              <motion.button
                onClick={handleCreateNextChapter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative flex items-center gap-2 bg-gradient-to-r from-purple-600 to-amber-500 text-white px-6 py-3 rounded-lg font-medium shadow-lg overflow-hidden"
              >
                {/* 배경 애니메이션 */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-amber-400/20"
                  animate={{
                    x: ['0%', '100%', '0%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />

                {/* 아이콘 애니메이션 */}
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                >
                  <Plus size={20} className="text-white" />
                </motion.div>

                <span className="relative z-10">다음 챕터 작성</span>

                {/* 스파클 아이콘 */}
                <motion.div
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute right-2"
                >
                  <Sparkles size={16} className="text-amber-300" />
                </motion.div>
              </motion.button>
            )}
          </div>

          {story.chapters.length === 0 ? (
            <div className="text-center py-12 bg-gray-800/30 backdrop-blur rounded-lg border border-purple-500/20">
              <p className="text-gray-400">아직 작성된 챕터가 없습니다</p>
              {isAuthor && (
                <button
                  onClick={() => router.push(`/write/editor?storyId=${story.id}`)}
                  className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  첫 챕터 작성하기
                </button>
              )}
            </div>
          ) : (
            story.chapters
              .sort((a, b) => a.sequence - b.sequence)
              .map((chapter) => (
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                  className="group bg-gray-800/30 backdrop-blur p-4 rounded-lg border border-purple-500/20 cursor-pointer"
                  onClick={() => router.push(`/stories/${story.id}/chapters/${chapter.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">
                        {chapter.sequence}화: {chapter.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{new Date(chapter.createdAt).toLocaleDateString()}</p>
                    </div>
                    <ChevronRight className="text-gray-600 group-hover:text-purple-400 transition-colors" size={20} />
                  </div>
                </motion.div>
              ))
          )}
        </div>

        {/* 삭제 확인 모달 */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          title="스토리 삭제"
          description="정말 이 스토리를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
          confirmText="삭제"
          cancelText="취소"
        />
      </div>
    </div>
  );
}
