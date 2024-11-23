import { Star } from 'lucide-react';
import { StoryCard } from '@/components/story/StoryCard';

interface Story {
  title: string;
  author: string;
  likes: number;
  rating: number;
}

interface PopularStoriesProps {
  stories: Story[];
}

export function PopularStories({ stories }: PopularStoriesProps) {
  return (
    <section className="px-4 mb-8">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Star className="text-amber-400" size={18} />
        인기 스토리
      </h3>
      <div className="space-y-4">
        {stories.map((story, idx) => (
          <StoryCard key={idx} story={story} />
        ))}
      </div>
    </section>
  );
} 