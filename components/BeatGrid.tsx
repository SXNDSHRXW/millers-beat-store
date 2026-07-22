'use client';

import { useState, useEffect } from 'react';
import { BeatCard3D } from './3d/BeatCard3D';
import { Beat } from '@/types';
import { getBeats } from '@/lib/supabase';
import { Search, Filter } from 'lucide-react';

const genres = ['ALL', 'HIP HOP', 'GRIME', 'DRILL', 'TRAP', 'BOOM BAP'];
const moods = ['ALL', 'DARK', 'AGGRESSIVE', 'ENERGETIC', 'CHILL', 'MELODIC'];

export function BeatGrid() {
  const [beats, setBeats] = useState<Beat[]>([]);
  const [filteredBeats, setFilteredBeats] = useState<Beat[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('ALL');
  const [selectedMood, setSelectedMood] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBeats() {
      try {
        const data = await getBeats();
        setBeats(data);
        setFilteredBeats(data);
      } catch (error) {
        console.error('Failed to load beats:', error);
        // Fallback demo data
        const demoBeats: Beat[] = [
          {
            id: '1', title: 'GHOST TOWN', slug: 'ghost-town', bpm: 140, musicalKey: 'D# Minor',
            genre: 'GRIME', mood: ['Dark', 'Aggressive'], tags: ['grime', 'dark', '140'],
            description: 'Dark grime instrumental with heavy bass.', previewUrl: '',
            artworkUrl: 'https://via.placeholder.com/600x800/1a1a1a/00d4ff?text=MILLERS1514525253440-b393452e8d26?w=600&h=800&fit=crop',
            stripeWavId: 'price_wav_1', stripeStemsId: 'price_stems_1',
            priceWav: 2999, priceStems: 4999, isSold: false, soldAt: null,
            battleWins: 12, battleLosses: 3, createdAt: new Date().toISOString(),
          },
          {
            id: '2', title: 'SHADOW BOXER', slug: 'shadow-boxer', bpm: 95, musicalKey: 'A Minor',
            genre: 'HIP HOP', mood: ['Aggressive', 'Energetic'], tags: ['hip hop', 'boom bap'],
            description: 'Hard-hitting hip hop beat.', previewUrl: '',
            artworkUrl: 'https://via.placeholder.com/600x800/1a1a1a/00d4ff?text=MILLERS1493225457124-a3eb161ffa5f?w=600&h=800&fit=crop',
            stripeWavId: 'price_wav_2', stripeStemsId: 'price_stems_2',
            priceWav: 3499, priceStems: 5999, isSold: false, soldAt: null,
            battleWins: 8, battleLosses: 5, createdAt: new Date().toISOString(),
          },
          {
            id: '3', title: 'MIDNIGHT RUN', slug: 'midnight-run', bpm: 150, musicalKey: 'F Minor',
            genre: 'DRILL', mood: ['Dark', 'Energetic'], tags: ['drill', 'dark'],
            description: 'Intense drill beat.', previewUrl: '',
            artworkUrl: 'https://via.placeholder.com/600x800/1a1a1a/00d4ff?text=MILLERS1511671782779-c97d3d27a1d4?w=600&h=800&fit=crop',
            stripeWavId: 'price_wav_3', stripeStemsId: 'price_stems_3',
            priceWav: 3999, priceStems: 6999, isSold: true, soldAt: new Date().toISOString(),
            battleWins: 15, battleLosses: 2, createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: '4', title: 'IRON FIST', slug: 'iron-fist', bpm: 128, musicalKey: 'G Minor',
            genre: 'TRAP', mood: ['Aggressive', 'Dark'], tags: ['trap', 'hard'],
            description: 'Heavy trap instrumental.', previewUrl: '',
            artworkUrl: 'https://via.placeholder.com/600x800/1a1a1a/00d4ff?text=MILLERS1514320291840-2e0a9bf2a9ae?w=600&h=800&fit=crop',
            stripeWavId: 'price_wav_4', stripeStemsId: 'price_stems_4',
            priceWav: 2799, priceStems: 4799, isSold: false, soldAt: null,
            battleWins: 6, battleLosses: 7, createdAt: new Date().toISOString(),
          },
          {
            id: '5', title: 'BACK ALLEY', slug: 'back-alley', bpm: 88, musicalKey: 'C Minor',
            genre: 'BOOM BAP', mood: ['Chill', 'Dark'], tags: ['boom bap', 'lofi'],
            description: 'Classic boom bap vibe.', previewUrl: '',
            artworkUrl: 'https://via.placeholder.com/600x800/1a1a1a/00d4ff?text=MILLERS1459749411175-04bf5292ceea?w=600&h=800&fit=crop',
            stripeWavId: 'price_wav_5', stripeStemsId: 'price_stems_5',
            priceWav: 2499, priceStems: 4499, isSold: false, soldAt: null,
            battleWins: 3, battleLosses: 4, createdAt: new Date().toISOString(),
          },
          {
            id: '6', title: 'NEON DREAMS', slug: 'neon-dreams', bpm: 130, musicalKey: 'E Minor',
            genre: 'GRIME', mood: ['Energetic', 'Melodic'], tags: ['grime', 'melodic'],
            description: 'Melodic grime with synths.', previewUrl: '',
            artworkUrl: 'https://via.placeholder.com/600x800/1a1a1a/00d4ff?text=MILLERS1511379938547-c1f69419868d?w=600&h=800&fit=crop',
            stripeWavId: 'price_wav_6', stripeStemsId: 'price_stems_6',
            priceWav: 3299, priceStems: 5299, isSold: false, soldAt: null,
            battleWins: 9, battleLosses: 3, createdAt: new Date().toISOString(),
          },
        ];
        setBeats(demoBeats);
        setFilteredBeats(demoBeats);
      } finally {
        setIsLoading(false);
      }
    }
    loadBeats();
  }, []);

  useEffect(() => {
    let result = beats;

    if (selectedGenre !== 'ALL') {
      result = result.filter((b) => b.genre.toUpperCase() === selectedGenre);
    }

    if (selectedMood !== 'ALL') {
      result = result.filter((b) => 
        b.mood.some((m) => m.toUpperCase() === selectedMood)
      );
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((b) =>
        b.title.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q)) ||
        b.genre.toLowerCase().includes(q)
      );
    }

    setFilteredBeats(result);
  }, [selectedGenre, selectedMood, searchQuery, beats]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="text-2xl font-comic tracking-wider mb-4 animate-pulse text-neon-blue">
            INKING...
          </div>
          <div className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-neon-green animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="SEARCH BEATS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-2 border-ink/30 pl-10 pr-4 py-3 text-sm tracking-wider focus:border-neon-blue focus:outline-none transition-colors"
          />
        </div>

        {/* Genre & Mood Filters */}
        <div className="flex flex-wrap gap-2 justify-center">
          <div className="flex items-center gap-2 mr-4">
            <Filter size={14} className="text-gray-500" />
            <span className="text-xs tracking-wider text-gray-500">GENRE</span>
          </div>
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3 py-1 text-xs tracking-wider border transition-all ${
                selectedGenre === genre
                  ? 'border-neon-blue text-neon-blue box-glow-blue'
                  : 'border-white/20 text-gray-400 hover:border-white/40'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          <div className="flex items-center gap-2 mr-4">
            <Filter size={14} className="text-gray-500" />
            <span className="text-xs tracking-wider text-gray-500">MOOD</span>
          </div>
          {moods.map((mood) => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={`px-3 py-1 text-xs tracking-wider border transition-all ${
                selectedMood === mood
                  ? 'border-neon-green text-neon-green box-glow-green'
                  : 'border-white/20 text-gray-400 hover:border-white/40'
              }`}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-6 px-2">
        <span className="text-xs tracking-wider text-gray-500">
          {filteredBeats.length} BEAT{filteredBeats.length !== 1 ? 'S' : ''} FOUND
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredBeats.map((beat, index) => (
          <BeatCard3D key={beat.id} beat={beat} index={index} />
        ))}
      </div>

      {filteredBeats.length === 0 && (
        <div className="text-center py-20">
          <p className="text-2xl font-comic tracking-wider text-gray-500">
            NO BEATS FOUND
          </p>
          <p className="text-sm text-gray-600 mt-2 tracking-wider">
            TRY A DIFFERENT SEARCH
          </p>
        </div>
      )}
    </div>
  );
}
