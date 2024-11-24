'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Wand2, Save, Send, Book, Sparkles, User, Crown, MessageCircle, Zap, LucideIcon } from 'lucide-react';
import { BackButton } from '@/components/common/BackButton';
import { EditorState } from '@/types';
import { useStoryStore } from '@/store/storyStore';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/Modal';


export default function StoryEditorPage() {
  const { selectedCharacter, selectedGenre, selectedStoryPrompt, chapterContext, setCharacter, setGenre, setStoryPrompt } = useStoryStore();
  const searchParams = useSearchParams();
  const [editorState, setEditorState] = useState<EditorState>({
    character: selectedCharacter,
    genre: selectedGenre,
    title: selectedStoryPrompt?.title || '',
    preview: selectedStoryPrompt?.preview || '',
    content: chapterContext?.currentChapter?.content || '',
    chapterContext: chapterContext,
    suggestions: [],
    isGenerating: false,
    selectedSuggestion: null,
  });

  const router = useRouter();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  // storyId로 스토리 정보 조회
  const fetchStoryInfo = async (storyId: string) => {
    try {
      const response = await fetch(`/api/stories/${storyId}`);
      if (!response.ok) throw new Error('스토리 정보를 불러오는데 실패했습니다.');
      
      const story = await response.json();
      console.log(story);
      
      // 스토리 정보로 전역 상태 업데이트
      setCharacter(story.mainCharacter);
      setGenre(story.genre[0]); // 첫 번째 장르를 기본값으로 사용
      setStoryPrompt({
        title: story.title,
        description: story.description,
        preview: story.description
      });

      setEditorState(prev => ({
        ...prev,
        content: story.content,
        character: story.mainCharacter,
        genre: story.genre[0],
        title: story.title,
        preview: story.description
      }));

    } catch (error) {
      console.error('스토리 정보 로딩 에러:', error);
    }
  };

  useEffect(() => {
    const storyId = searchParams?.get('storyId');
    const content = searchParams?.get('content');
    const sequence = searchParams?.get('sequence');

    if (storyId) {
      // storyId가 있으면 스토리 정보 조회
      fetchStoryInfo(storyId);
      setEditorState(prev => ({ ...prev, storyId }));
    }


    if (sequence && content) {
      setEditorState(prev => ({
        ...prev,
        content: decodeURIComponent(content),
        chapterContext: {
          ...prev.chapterContext!,
          currentChapter: {
            content: '',
            sequence: parseInt(sequence)
          }
        }
      }));
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
          title: editorState.title,
          preview: editorState.preview,
          content: editorState.content ? editorState.content : chapterContext?.previousChapter?.content,
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
    if (!session?.user?.id) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    if (!editorState.content.trim()) {
      toast.error('내용을 입력해주세요.');
      return;
    }

    setIsSaving(true);
    try {
      // 스토리 생성 (첫 챕터인 경우)
      let storyId = editorState.storyId;
      if (!storyId) {
        const storyResponse = await fetch('/api/stories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: editorState.title,
            description: editorState.preview,
            genre: [editorState.genre],
            mainCharacterId: editorState.character?.id,
          }),
        });

        if (!storyResponse.ok) {
          throw new Error('스토리 생성 실패');
        }

        const storyData = await storyResponse.json();
        storyId = storyData.id;
      }

      // 챕터 저장
      const response = await fetch('/api/chapters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${editorState.chapterContext?.currentChapter?.sequence || 1}화`,
          content: editorState.content,
          storyId,
          sequence: editorState.chapterContext?.currentChapter?.sequence || 1,
        }),
      });

      if (!response.ok) {
        throw new Error('챕터 저장 실패');
      }

      toast.success('저장되었습니다.');

      // 챕터 컨텍스트 업데이트
      const chapterSummary = {
        content: editorState.content,
        sequence: editorState.chapterContext?.currentChapter?.sequence || 1
      };

      setEditorState(prev => ({
        ...prev,
        storyId,
        chapterContext: {
          ...prev.chapterContext!,
          previousChapter: chapterSummary,
          currentChapter: {
            content: '',
            sequence: (prev.chapterContext?.currentChapter?.sequence || 1) + 1
          }
        }
      }));

    } catch (error) {
      console.error('저장 실패:', error);
      toast.error('저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  // 뒤로가기 처리
  const handleBack = () => {
      setShowExitModal(true);
  };

  // 실제 뒤로가기 실행
  const confirmExit = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <BackButton onClick={handleBack} />
        </div>

        {/* 간소화된 스토리 정보 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-gray-800/30 backdrop-blur p-4 rounded-lg border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-white">
                  {editorState.title || '제목 없음'}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-gray-400">{editorState.genre}</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-400">
                    {editorState.chapterContext?.currentChapter?.sequence || 1}화
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowDetailsModal(true)}
                className="px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-lg text-sm hover:bg-purple-500/30 transition-colors"
              >
                상세정보
              </button>
            </div>
          </div>
        </motion.div>

        {/* 에디터 영역 */}
        <div className="bg-gray-800/30 backdrop-blur p-6 rounded-lg border border-purple-500/20 mb-6">
          <textarea
            value={editorState.content}
            onChange={(e) => setEditorState(prev => ({ ...prev, content: e.target.value }))}
            className="w-full h-[60vh] bg-transparent text-white focus:outline-none resize-none"
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
            <button
              onClick={saveChapter}
              disabled={isSaving}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              <Save size={18} />
              {isSaving ? '저장 중...' : '저장하기'}
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

        {/* 상세정보 모달 */}
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          onConfirm={() => setShowDetailsModal(false)}
          title="스토리 상세정보"
          description={
            <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-2">
              {/* 캐릭터 프로필 섹션 */}
              <div className="relative">
                <div className="w-32 h-32 mx-auto mb-4 rounded-2xl overflow-hidden border-4 border-purple-500/30 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                  {selectedCharacter?.profileImage ? (
                    <Image
                      src={selectedCharacter.profileImage}
                      alt={selectedCharacter.name}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-amber-500/20 flex items-center justify-center">
                      <User className="text-purple-400" size={48} />
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-1">{selectedCharacter?.name}</h3>
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <span className={`px-2 py-0.5 rounded-full text-sm ${
                      selectedCharacter?.gender === '남성'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-pink-500/20 text-pink-300'
                    }`}>
                      {selectedCharacter?.gender}
                    </span>
                    <span>•</span>
                    <span>{selectedCharacter?.age}세</span>
                  </div>
                </div>
              </div>

              {/* 능력치 그리드 */}
              {selectedCharacter?.stats && (
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(selectedCharacter.stats).map(([stat, value]) => {
                    const statConfig: { icon: LucideIcon; color: string; label: string } = {
                      appearance: { icon: User, color: 'pink', label: '외모' },
                      charisma: { icon: Crown, color: 'amber', label: '카리스마' },
                      speech: { icon: MessageCircle, color: 'blue', label: '말빨' },
                      luck: { icon: Sparkles, color: 'purple', label: '운' },
                      wit: { icon: Zap, color: 'green', label: '재치' }
                    }[stat as keyof typeof selectedCharacter.stats];

                    const Icon = statConfig.icon;

                    return (
                      <div key={stat} className="bg-gray-800/50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`p-1.5 rounded-lg bg-${statConfig.color}-500/20`}>
                            <Icon className={`text-${statConfig.color}-400`} size={16} />
                          </div>
                          <span className="text-sm text-gray-300">{statConfig.label}</span>
                          <span className={`ml-auto text-${statConfig.color}-400 font-bold`}>{value}</span>
                        </div>
                        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${value}%` }}
                            className={`h-full bg-gradient-to-r from-${statConfig.color}-600 to-${statConfig.color}-400`}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 스토리 정보 */}
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                  <Book className="text-amber-400" size={16} />
                  스토리 설정
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">장르</span>
                    <span className="text-white">{selectedGenre}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">현재 챕터</span>
                    <span className="text-white">{chapterContext?.currentChapter?.sequence || 1}화</span>
                  </div>
                  {selectedStoryPrompt?.preview && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <p className="text-sm text-gray-300">{selectedStoryPrompt.preview}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          }
        />

        {/* 뒤로가기 확인 모달 */}
        <Modal
          isOpen={showExitModal}
          onClose={() => setShowExitModal(false)}
          onConfirm={confirmExit}
          title="페이지 나가기"
          description="저장하지 않은 내용은 모두 삭제됩니다."
          confirmText="나가기"
          cancelText="취소"
        />
      </div>
    </div>
  );
} 