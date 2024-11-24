
interface VoteCardProps {
  vote: {
    story: string;
    options: string[];
    endTime: string;
  };
}

export function VoteCard({ vote }: VoteCardProps) {
  return (
    <div className="bg-gray-800/50 backdrop-blur p-4 rounded-lg border border-purple-500/20">
      <h4 className="text-base font-semibold text-white mb-3">{vote.story}</h4>
      <div className="space-y-2">
        {vote.options.map((option, idx) => (
          <button
            key={idx}
            className="w-full bg-gray-700/50 text-left text-gray-200 p-3 rounded-lg 
                     border border-purple-500/20 text-sm hover:border-amber-500/50 
                     transition-all hover:bg-gray-700/70"
          >
            {option}
          </button>
        ))}
      </div>
      <p className="text-amber-400 text-xs mt-3">{vote.endTime}</p>
    </div>
  );
} 