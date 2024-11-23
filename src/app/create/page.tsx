import { GenreSelection } from '@/components/create/GenreSelection';
import { QuickStartSteps } from '@/components/create/QuickStartSteps';
import { BackButton } from '@/components/common/BackButton';

const genres = [
  {
    id: 'regression',
    title: '회귀물',
    description: '과거로 돌아가 인생을 다시 시작하는 이야기',
    icon: '⏰',
    examples: ['회귀자의 게임', '두번째 기회에서']
  },
  {
    id: 'mukhyub',
    title: '무협',
    description: '무공과 협객들의 세계를 다룬 이야기',
    icon: '⚔️',
    examples: ['검신의 귀환', '무림최강 신입문주']
  },
  {
    id: 'rofan',
    title: '로맨스 판타지',
    description: '판타지 세계관의 로맨스 스토리',
    icon: '👑',
    examples: ['황녀의 재혼', '빌런 영애 생존기']
  },
  {
    id: 'modern',
    title: '현대판타지',
    description: '현실 세계에서 벌어지는 초자연적 이야기',
    icon: '🌆',
    examples: ['던전 속 사회생활', '서울역 헌터']
  },
  {
    id: 'munchkin',
    title: '먼치킨',
    description: '압도적인 성장과 전개의 이야기',
    icon: '💪',
    examples: ['최강자의 귀환', 'SSS급 성장']
  },
  {
    id: 'academy',
    title: '학원물',
    description: '학교를 배경으로 한 성장 스토리',
    icon: '🎓',
    examples: ['천재의 수련일기', '마법학교 F급 신입생']
  },
  {
    id: 'game',
    title: '게임판타지',
    description: '게임 같은 세계관의 이야기',
    icon: '🎮',
    examples: ['레벨업 하는 회사원', '시작부터 9999렙']
  },
  {
    id: 'reincarnation',
    title: '환생/빙의',
    description: '다른 세계의 몸에 빙의하는 이야기',
    icon: '✨',
    examples: ['빌런의 몸으로 환생했다', '공녀로 살아남기']
  }
];

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <BackButton href="/" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-8">
          나만의 이야기 만들기
        </h1>
        
        {/* 퀵 스타트 가이드 */}
        <QuickStartSteps className="mb-12" />
        
        {/* 장르 선택 */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-6">
            어떤 이야기를 들려주고 싶으신가요?
          </h2>
          <GenreSelection genres={genres} />
        </section>
      </div>
    </div>
  );
} 