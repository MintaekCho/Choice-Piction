interface StoryCardProps {
  story: {
    title: string;
    author: string;
    rating: number;
  };
}

export function StoryCard({ story }: StoryCardProps) {
  return (
    <div className="bg-gray-800/50 backdrop-blur p-4 rounded-lg border border-purple-500/20">
      <h4 className="text-base font-semibold text-white mb-2">{story.title}</h4>
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">{story.author}</span>
        <span className="text-amber-400">★ {story.rating}</span>
      </div>
    </div>
  );
} 