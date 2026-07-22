'use client';

import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { Play, Pause, SkipForward, Volume2 } from 'lucide-react';
import { useAudioStore } from '@/lib/store';

export function AudioPlayer() {
  const howlRef = useRef<Howl | null>(null);
  const { currentBeat, isPlaying, togglePlay, volume } = useAudioStore();

  useEffect(() => {
    if (currentBeat?.previewUrl) {
      if (howlRef.current) {
        howlRef.current.unload();
      }

      howlRef.current = new Howl({
        src: [currentBeat.previewUrl],
        html5: true,
        volume,
        onend: () => {
          togglePlay();
        },
      });

      if (isPlaying) {
        howlRef.current.play();
      }
    }

    return () => {
      if (howlRef.current) {
        howlRef.current.unload();
      }
    };
  }, [currentBeat]);

  useEffect(() => {
    if (howlRef.current) {
      if (isPlaying) {
        howlRef.current.play();
      } else {
        howlRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (howlRef.current) {
      howlRef.current.volume(volume);
    }
  }, [volume]);

  if (!currentBeat) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-void/95 backdrop-blur-md border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
        <div className="flex items-center gap-4">
          {/* Beat info */}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-comic tracking-wider truncate">
              {currentBeat.title}
            </div>
            <div className="text-xs text-gray-500 tracking-wider">
              {currentBeat.bpm} BPM • {currentBeat.genre}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="w-10 h-10 border border-neon-blue flex items-center justify-center hover:bg-neon-blue/20 transition-colors"
            >
              {isPlaying ? (
                <Pause size={18} className="text-neon-blue" />
              ) : (
                <Play size={18} className="text-neon-blue ml-0.5" />
              )}
            </button>
            <button className="w-8 h-8 border border-white/20 flex items-center justify-center hover:border-neon-green transition-colors">
              <SkipForward size={14} />
            </button>
          </div>

          {/* Volume */}
          <div className="hidden md:flex items-center gap-2">
            <Volume2 size={14} className="text-gray-500" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => useAudioStore.getState().setVolume(parseFloat(e.target.value))}
              className="w-20 accent-neon-blue"
            />
          </div>

          {/* Waveform visual */}
          <div className="hidden lg:flex items-center gap-0.5">
            {Array.from({ length: 30 }, (_, i) => (
              <div
                key={i}
                className="w-1 bg-neon-blue/60 rounded-full transition-all duration-100"
                style={{
                  height: isPlaying 
                    ? `${Math.random() * 24 + 4}px` 
                    : '4px',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
