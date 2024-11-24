'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Wand2, Sparkles, RefreshCw, ChevronRight } from 'lucide-react';
import { BackButton } from '@/components/common/BackButton';
import { StoryPrompt } from '@/types';
import { useStoryStore } from '@/store/storyStore';

export default function WriteWithAIPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [storyPrompts, setStoryPrompts] = useState<StoryPrompt[]>([]);

  const { selectedCharacter, selectedGenre, setStoryPrompt } = useStoryStore();
  console.log(selectedCharacter)
  useEffect(() => {
    if (selectedCharacter && selectedGenre) {
      generateStoryPrompts();
    } 
  }, [selectedCharacter, selectedGenre]);

  const generateStoryPrompts = useCallback(async () => {
    if (!selectedCharacter || !selectedGenre) {
      router.push('/create');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/generate-prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          character: selectedCharacter,
          genre: selectedGenre,
        }),
      });

      if (!response.ok) {
        throw new Error('API 요청 실패');
      }

      const data = await response.json();
      setStoryPrompts(data?.stories || []);
    } catch (error) {
      console.error('프롬프트 생성 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCharacter, selectedGenre]);


  const handlePromptSelect = (prompt: StoryPrompt) => {
    setStoryPrompt(prompt);
    router.push(`/write/editor`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <BackButton href="/create/story" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold text-white mb-4">
            AI와 함께 시작하기
          </h1>
          <p className="text-gray-400">
            AI가 추천하는 흥미진진한 스토리 시작점을 선택해보세요
          </p>
        </motion.div>

        {/* 프롬프트 새로고침 버튼 */}
        <div className="flex justify-end mb-6">
          <button
            onClick={generateStoryPrompts}
            disabled={isLoading}
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            <span className="text-sm">새로운 추천받기</span>
          </button>
        </div>

        {/* 프롬프트 목록 */}
        <div className="space-y-4">
          {isLoading ? (
            // 스켈레톤 로딩 UI
            [...Array(3)].map((_, idx) => (
              <div key={idx} className="bg-gray-800/30 backdrop-blur p-6 rounded-lg border border-purple-500/20 animate-pulse">
                <div className="flex items-start justify-between">
                  <div className="w-full">
                    <div className="h-6 bg-gray-700/50 rounded w-1/3 mb-3"></div>
                    <div className="h-4 bg-gray-700/50 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-700/50 rounded w-full"></div>
                  </div>
                  <div className="h-6 w-6 bg-gray-700/50 rounded"></div>
                </div>
              </div>
            ))
          ) : storyPrompts.length === 0 ? (
            // 프롬프트가 없을 때 메시지
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">아직 생성된 프롬프트가 없습니다</div>
              <button
                onClick={generateStoryPrompts}
                className="text-purple-400 hover:text-purple-300 transition-colors text-sm flex items-center gap-2 mx-auto"
              >
                <Wand2 size={16} />
                프롬프트 생성하기
              </button>
            </div>
          ) : (
            // 프롬프트 목록
            storyPrompts.map((prompt, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-gray-800/30 backdrop-blur p-6 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer"
                onClick={() => handlePromptSelect(prompt)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <Sparkles className="text-amber-400" size={20} />
                      {prompt.title}
                    </h3>
                    <p className="text-purple-300 text-sm mb-4">{prompt.description}</p>
                    <p className="text-gray-400 text-sm">{prompt.preview}</p>
                  </div>
                  <ChevronRight className="text-gray-600 group-hover:text-purple-400 transition-colors" size={24} />
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 