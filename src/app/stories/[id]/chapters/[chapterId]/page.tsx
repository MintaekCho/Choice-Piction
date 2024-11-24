'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Edit, Clock } from 'lucide-react';
import { BackButton } from '@/components/common/BackButton';
import { useSession } from 'next-auth/react';
import { useStoryStore } from '@/store/storyStore';

interface Chapter {
  id: string;
  title: string;
  content: string;
  sequence: number;
  createdAt: string;
  storyId: string;
}

interface Story {
  id: string;
  userId: string;
  title: string;
}

interface ChapterResponse {
  chapter: Chapter;
  story: Story;
  navigation: {
    previousChapterId: string | null;
    nextChapterId: string | null;
  };
}

export default function ChapterDetailPage() {
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const isAuthor = session?.user?.id === story?.userId;
  const { setChapterContext } = useStoryStore();

  const [navigation, setNavigation] = useState<{
    previousChapterId: string | null;
    nextChapterId: string | null;
  }>({ previousChapterId: null, nextChapterId: null });

  useEffect(() => {
    fetchChapter();
  }, []);

  const fetchChapter = async () => {
    try {
      const response = await fetch(`/api/chapters/${params.chapterId}`);
      if (!response.ok) throw new Error('챕터를 불러오는데 실패했습니다.');
      const data: ChapterResponse = await response.json();
      setChapter(data.chapter);
      setStory(data.story);
      setNavigation(data.navigation);
    } catch (error) {
      console.error('챕터 로딩 에러:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleEditPage = () => {
    setChapterContext({
      currentChapter: {
        content: chapter?.content || '',
        sequence: chapter?.sequence || 0,
      },
      previousChapter: {
        content: '',
        sequence: 0,
      },
      characterState: {
        name: '',
        stats: {},
        currentStatus: [],
      },
    });
    router.push(`/write/editor?storyId=${story?.id}&chapterId=${chapter?.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!chapter || !story) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <BackButton />
          <div className="text-center mt-12">
            <h1 className="text-2xl text-white mb-4">챕터를 찾을 수 없습니다</h1>
            <p className="text-gray-400">존재하지 않거나 삭제된 챕터입니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <BackButton onClick={handleBack} />
        </div>

        {/* 챕터 헤더 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">
              {chapter.sequence}화: {chapter.title}
            </h1>
            {isAuthor && (
              <button
                onClick={handleEditPage}
                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Edit size={18} />
                <span className="text-sm">수정하기</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {new Date(chapter.createdAt).toLocaleDateString()}
            </span>
          </div>
        </motion.div>

        {/* 챕터 내용 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-800/30 backdrop-blur p-6 rounded-lg border border-purple-500/20 mb-8"
        >
          <div className="prose prose-invert max-w-none">
            {chapter.content.split('\n').map((paragraph, idx) => (
              <p key={idx} className="mb-4 text-gray-300 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </motion.div>

        {/* 이전/다음 챕터 네비게이션 */}
        <div className="flex justify-between">
          <button
            onClick={() =>
              navigation.previousChapterId &&
              router.push(`/stories/${story.id}/chapters/${navigation.previousChapterId}`)
            }
            disabled={!navigation.previousChapterId}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <ChevronLeft size={20} />
            이전 화
          </button>
          <button
            onClick={() =>
              navigation.nextChapterId && router.push(`/stories/${story.id}/chapters/${navigation.nextChapterId}`)
            }
            disabled={!navigation.nextChapterId}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            다음 화
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
