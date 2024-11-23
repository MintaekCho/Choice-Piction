'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Genre {
  id: string;
  title: string;
  description: string;
  icon: string;
  examples: string[];
}

export function GenreSelection({ genres }: { genres: Genre[] }) {
  const router = useRouter();

  const handleGenreSelect = (genreId: string) => {
    router.push(`/create/character?genre=${genreId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {genres.map((genre) => (
        <motion.button
          key={genre.id}
          className="bg-gray-800/30 backdrop-blur p-6 rounded-lg border border-purple-500/20
                    hover:border-purple-500/40 transition-colors text-left"
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleGenreSelect(genre.id)}
        >
          <div className="text-4xl mb-4">{genre.icon}</div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {genre.title}
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            {genre.description}
          </p>
          <div className="text-xs text-purple-300">
            예시: {genre.examples.join(', ')}
          </div>
        </motion.button>
      ))}
    </div>
  );
} 