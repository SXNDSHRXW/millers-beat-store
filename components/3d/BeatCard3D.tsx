'use client';

import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Pause, ShoppingCart } from 'lucide-react';
import { Beat } from '@/types';
import { formatPrice, getBeatStats } from '@/lib/utils';
import { useCurrencyPreference } from '@/lib/currency';
import { useAudioStore, useCursorStore } from '@/lib/store';

interface BeatCard3DProps {
  beat: Beat;
  index?: number;
}

export function BeatCard3D({ beat, index = 0 }: BeatCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { currentBeat, isPlaying, setCurrentBeat, togglePlay } = useAudioStore();
  const setCursorType = useCursorStore((s) => s.setCursorType);
  const { activeCurrency, locale } = useCurrencyPreference();
  const stats = getBeatStats(beat);
  const isCurrentBeat = currentBeat?.id === beat.id;
  const isPlayingThis = isCurrentBeat && isPlaying;

  useEffect(() => {
    if (cardRef.current && !beat.isSold) {
      gsap.to(cardRef.current, {
        y: Math.sin(Date.now() * 0.001 + index) * 5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
  }, [index, beat.isSold]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || beat.isSold) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    setMousePos({ x, y });

    gsap.to(cardRef.current, {
      rotateX: -y * 15,
      rotateY: x * 15,
      translateZ: 40,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCursorType('default');
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 8,
      rotateY: -5,
      translateZ: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setCursorType('needle');
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCurrentBeat) {
      togglePlay();
    } else {
      setCurrentBeat(beat);
    }
  };

  const statLabels = ['VIBE', 'GROOVE', 'BASS', 'ENERGY'];
  const statValues = [stats.vibe, stats.groove, stats.bass, stats.energy];

  return (
    <div className="perspective-1000">
      <div
        ref={cardRef}
        className={`relative preserve-3d transition-all duration-300 ${
          beat.isSold ? 'opacity-40' : ''
        }`}
        style={{
          transform: 'rotateX(8deg) rotateY(-5deg)',
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
      >
        <Link href={`/beats/${beat.slug}`} className="block">
          {/* Card Container */}
          <div 
            className={`relative w-full aspect-[3/4] border-2 ${
              isHovered && !beat.isSold 
                ? 'border-neon-green box-glow-green' 
                : 'border-ink'
            } bg-void overflow-hidden`}
            style={{ transform: 'translateZ(0)' }}
          >
            {/* Artwork Layer */}
            <div 
              className="absolute inset-0"
              style={{ transform: 'translateZ(20px)' }}
            >
              <Image
                src={beat.artworkUrl || '/images/placeholder-beat.jpg'}
                alt={beat.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Info Layer */}
            <div 
              className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-void to-transparent"
              style={{ transform: 'translateZ(40px)' }}
            >
              <h3 className="text-xl font-comic tracking-wider mb-1">{beat.title}</h3>
              <div className="flex gap-3 text-xs tracking-wider text-gray-400 mb-3">
                <span>BPM: {beat.bpm}</span>
                <span>KEY: {beat.musicalKey}</span>
                <span className="text-neon-blue">{beat.genre.toUpperCase()}</span>
              </div>

              {/* Stats */}
              <div className="space-y-1 mb-3">
                {statLabels.map((label, i) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="text-[10px] tracking-wider w-16">{label}</span>
                    <div className="flex-1 stat-bar">
                      <div 
                        className="stat-bar-fill"
                        style={{ width: `${statValues[i] * 10}%` }}
                      />
                    </div>
                    <span className="text-[10px] w-6 text-right">{statValues[i]}/10</span>
                  </div>
                ))}
              </div>

              {/* Price & Buy */}
              {!beat.isSold && (
                <div 
                  className="flex items-center justify-between"
                  style={{ transform: 'translateZ(60px)' }}
                >
                  <div className="flex gap-2">
                    <span className="text-sm font-bold text-neon-green">
                      {formatPrice(beat.priceWav, activeCurrency, locale)}
                    </span>
                    <span className="text-xs text-gray-500">.WAV</span>
                  </div>
                  <ShoppingCart size={16} className="text-neon-green" />
                </div>
              )}
            </div>

            {/* Sold badge */}
            {beat.isSold && (
              <div 
                className="absolute top-3 left-3 z-10 pointer-events-none"
                style={{ transform: 'translateZ(80px)' }}
              >
                <div className="wood-sign px-4 py-2 transform -rotate-2">
                  <span 
                    className="text-lg font-comic tracking-widest"
                    style={{ 
                      color: '#39ff14',
                      textShadow: '0 0 10px #39ff14, 0 0 20px #39ff14, 2px 2px 4px rgba(0,0,0,0.8)',
                    }}
                  >
                    SOLD
                  </span>
                </div>
              </div>
            )}

            {/* New badge */}
            {new Date(beat.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && !beat.isSold && (
              <div 
                className="absolute top-3 right-3 px-3 py-1 bg-neon-blue text-void text-xs font-bold tracking-wider"
                style={{ transform: 'translateZ(60px)' }}
              >
                NEW!
              </div>
            )}

          </div>
        </Link>

        {/* Play overlay — outside Link to prevent navigation */}
        <div
          className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          style={{ top: 0, margin: '2px' }}
        >
          <button
            onClick={handlePlay}
            className="w-16 h-16 border-2 border-neon-blue rounded-full flex items-center justify-center hover:bg-neon-blue/20 transition-colors pointer-events-auto"
            onMouseEnter={() => setCursorType('buy')}
            onMouseLeave={() => setCursorType('needle')}
          >
            {isPlayingThis ? (
              <Pause size={28} className="text-neon-blue" />
            ) : (
              <Play size={28} className="text-neon-blue ml-1" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
