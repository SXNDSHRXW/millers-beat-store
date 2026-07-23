'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Howl } from 'howler';
import { Play, Pause, SkipForward, Volume2 } from 'lucide-react';
import { useAudioStore } from '@/lib/store';

export function AudioPlayer() {
  const howlRef = useRef<Howl | null>(null);
  const rafRef = useRef<number>(0);
  const { currentBeat, isPlaying, togglePlay, volume } = useAudioStore();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Progress tracking via rAF
  const tick = useCallback(() => {
    if (howlRef.current?.playing()) {
      setCurrentTime(howlRef.current.seek() as number);
    }
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (howlRef.current) {
      if (isPlaying) {
        howlRef.current.play();
        rafRef.current = requestAnimationFrame(tick);
      } else {
        howlRef.current.pause();
        cancelAnimationFrame(rafRef.current);
      }
    }
  }, [isPlaying, tick]);

  // Cleanup rAF on unmount
  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    if (currentBeat?.previewUrl) {
      cancelAnimationFrame(rafRef.current);
      if (howlRef.current) {
        howlRef.current.unload();
      }

      howlRef.current = new Howl({
        src: [currentBeat.previewUrl],
        html5: true,
        volume,
        onload: () => {
          setDuration(howlRef.current?.duration() ?? 0);
        },
        onplay: () => {
          setDuration(howlRef.current?.duration() ?? 0);
          rafRef.current = requestAnimationFrame(tick);
        },
        onend: () => {
          cancelAnimationFrame(rafRef.current);
          setCurrentTime(0);
          togglePlay();
        },
        onstop: () => {
          cancelAnimationFrame(rafRef.current);
          setCurrentTime(0);
        },
      });

      if (isPlaying) {
        howlRef.current.play();
      }
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (howlRef.current) {
        howlRef.current.unload();
      }
    };
  }, [currentBeat]);

  useEffect(() => {
    if (howlRef.current) {
      howlRef.current.volume(volume);
    }
  }, [volume]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !howlRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = ratio * duration;
    howlRef.current.seek(newTime);
    setCurrentTime(newTime);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentBeat) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-void/95 backdrop-blur-md border-t border-white/10">
      {/* Progress bar — clickable with knob */}
      <div
        ref={progressBarRef}
        className="relative h-4 w-full cursor-pointer group -mb-1.5"
        onClick={handleSeek}
      >
        {/* Track */}
        <div className="absolute top-1/2 -translate-y-1/2 h-1 w-full bg-white/10">
          <div
            className="h-full bg-neon-blue transition-colors duration-75 group-hover:bg-neon-green"
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* Knob */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_8px_rgba(0,229,255,0.6)]"
          style={{ left: `calc(${progress}% - ${progress > 0 && progress < 100 ? '7px' : '0px'})` }}
        />
      </div>

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

          {/* Time display */}
          <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500 tracking-wider min-w-[80px] justify-center">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
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
        </div>
      </div>
    </div>
  );
}
