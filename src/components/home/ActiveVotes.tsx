import { Clock } from 'lucide-react';
import { VoteCard } from '../vote/VoteCard';

interface Vote {
  story: string;
  options: string[];
  endTime: string;
}

interface ActiveVotesProps {
  votes: Vote[];
}

export function ActiveVotes({ votes }: ActiveVotesProps) {
  return (
    <section className="px-4">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Clock className="text-purple-400" size={18} />
        진행중인 투표
      </h3>
      <div className="space-y-4">
        {votes.map((vote, idx) => (
          <VoteCard key={idx} vote={vote} />
        ))}
      </div>
    </section>
  );
} 