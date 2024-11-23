'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNavigation } from '@/components/layout/BottomNavigation';
import { HeroSection } from '@/components/home/HeroSection';
import { CharacterSection } from '@/components/home/CharacterSection';
import { PopularStories } from '@/components/home/PopularStories';
import { ActiveVotes } from '@/components/home/ActiveVotes';
import { CreateStoryButton } from '@/components/story/CreateStoryButton';

const popularStories = [
  {
    title: '마법사의 귀환',
    author: '별빛작가',
    likes: 1200,
    rating: 4.8,
    thumbnail: '/images/stories/magic-return.jpg',
    tags: ['판타지', '액션', '성장'],
  },
  { title: '던전의 지배자', author: '달빛작가', likes: 980, rating: 4.7 },
  { title: '용사의 새벽', author: '하늘작가', likes: 850, rating: 4.6 },
];

const activeVotes = [
  {
    story: '마법사의 귀환',
    options: ['마법탑 입성', '고향으로 귀환', '새로운 모험'],
    endTime: '2시간 남음',
    participants: 1234,
    preview: '마법사 아카데미를 졸업한 주인공, 이제 그의 선택은?',
  },
];

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log('homepage session', session);

  useEffect(() => {
    console.log(session);
    if (session) {
      console.log('session', session);
    }
    if (!session?.user?.username && session?.user.username?.startsWith('user_')) {
      router.push('/register/username');
    }
  }, [session, router, status]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      <Header />

      <main className="pt-16 pb-20">
        <HeroSection />
        <CharacterSection />
        <PopularStories stories={popularStories} />
        <ActiveVotes votes={activeVotes} />
      </main>

      <CreateStoryButton />
      <BottomNavigation />
    </div>
  );
}
