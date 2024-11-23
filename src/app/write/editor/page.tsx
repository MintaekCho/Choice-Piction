'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Wand2, Save, Send } from 'lucide-react';
import { BackButton } from '@/components/common/BackButton';
import { EditorState } from '@/types';

export default function StoryEditorPage() {
  const searchParams = useSearchParams();
  const [editorState, setEditorState] = useState<EditorState>({
    character: null,
    genre: '',
    content: '',
    suggestions: [],
    isGenerating: false,
    selectedSuggestion: null,
    chapterContext: null
  });

  useEffect(() => {
    const prompt = searchParams?.get('prompt');
    const character = searchParams?.get('character');
    const genre = searchParams?.get('genre');

    if (prompt) {
      try {
        const { title, preview } = JSON.parse(decodeURIComponent(prompt));
        setEditorState(prev => ({
          ...prev,
          content: `# ${title}\n\n${preview}\n\n`
        }));
        if (character) setEditorState(prev => ({ ...prev, character: JSON.parse(decodeURIComponent(character)) }));
        if (genre) setEditorState(prev => ({ ...prev, genre }));
      } catch (e) {
        console.error('프롬프트 파싱 실패:', e);
      }
    }
  }, [searchParams]);

  const generateSuggestions = async () => {
    setEditorState(prev => ({ ...prev, isGenerating: true }));
    try {
      const response = await fetch('/api/ai/generate-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editorState.content,
          character: editorState.character,
          genre: editorState.genre,
          chapterContext: editorState.chapterContext
        }),
      });

      if (!response.ok) {
        throw new Error('API 요청 실패');
      }

      const data = await response.json();
      setEditorState(prev => ({
        ...prev,
        suggestions: data.suggestions,
      }));
    } catch (error) {
      console.error('제안 생성 실패:', error);
    } finally {
      setEditorState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const saveChapter = async () => {
    const chapterSummary = {
      summary: editorState.content.slice(0, 200) + '...',
      keyEvents: [],
    };

    setEditorState(prev => ({
      ...prev,
      chapterContext: {
        ...prev.chapterContext!,
        previousChapter: chapterSummary,
        currentChapter: {
          content: '',
          sequence: (prev.chapterContext?.currentChapter?.sequence || 1) + 1
        }
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <BackButton href="/write/ai" />
        </div>
        {/* 에디터 영역 */}
        <div className="bg-gray-800/30 backdrop-blur p-6 rounded-lg border border-purple-500/20 mb-6">
          <textarea
            value={editorState.content}
            onChange={(e) => setEditorState(prev => ({ ...prev, content: e.target.value }))}
            className="w-full h-96 bg-transparent text-white focus:outline-none resize-none"
            placeholder="이야기를 입력하세요..."
          />
        </div>

        {/* 도구 모음 */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={generateSuggestions}
            disabled={editorState.isGenerating}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {editorState.isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>생성 중...</span>
              </>
            ) : (
              <>
                <Wand2 size={16} />
                <span>AI 제안받기</span>
              </>
            )}
          </button>
          
          <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
              <Save size={16} />
              <span>임시저장</span>
            </button>
            <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-amber-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
              <Send size={16} />
              <span>발행하기</span>
            </button>
          </div>
        </div>

        {/* AI 제안 목록 */}
        {(editorState.suggestions?.length > 0 || editorState.isGenerating) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/30 backdrop-blur p-6 rounded-lg border border-purple-500/20"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Wand2 className="text-purple-400" size={20} />
                AI의 제안
              </h3>
              {editorState.selectedSuggestion && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditorState(prev => ({
                        ...prev,
                        content: prev.content + '\n' + prev.selectedSuggestion,
                        selectedSuggestion: null,
                        suggestions: []
                      }))
                    }}
                    className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-500 text-sm"
                  >
                    확정
                  </button>
                  <button
                    onClick={() => setEditorState(prev => ({ ...prev, selectedSuggestion: null }))}
                    className="px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600 text-sm"
                  >
                    취소
                  </button>
                </div>
              )}
            </div>
            <div className="space-y-2">
              {editorState.isGenerating ? (
                <div className="text-gray-400 text-center py-8">
                  <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  AI가 제안을 생성하고 있습니다...
                </div>
              ) : (
                editorState.suggestions?.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => setEditorState(prev => ({
                      ...prev,
                      selectedSuggestion: suggestion
                    }))}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      editorState.selectedSuggestion === suggestion
                        ? 'bg-purple-600/50 text-white'
                        : 'bg-gray-700/50 text-white hover:bg-gray-700'
                    }`}
                  >
                    {suggestion}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 