'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Crown, Instagram, Youtube, Globe } from 'lucide-react';
import { useCursorStore } from '@/lib/store';

export function AboutMeCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const setCursorType = useCursorStore((s) => s.setCursorType);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: -100, opacity: 0, rotateX: -30 },
        { 
          y: 0, 
          opacity: 1, 
          rotateX: 0,
          duration: 1, 
          ease: 'bounce.out',
          delay: 0.3,
        }
      );
    }
  }, []);

  const stats = [
    { label: 'BEATMAKING', value: 10 },
    { label: 'MIXING', value: 10 },
    { label: 'MASTERING', value: 10 },
    { label: 'PASSION', value: 10 },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-comic tracking-wider mb-4">
          ABOUT <span className="text-neon-green text-glow-green">ME</span>
        </h1>
        <p className="text-gray-500 tracking-widest">
          PRODUCER • BEATMAKER 
        </p>
      </div>

      <div 
        ref={cardRef}
        className="relative border-4 border-yellow-500/50 p-8 md:p-12"
        style={{
          boxShadow: '0 0 30px rgba(57, 255, 20, 0.2), inset 0 0 60px rgba(0, 212, 255, 0.05)',
        }}
        onMouseEnter={() => setCursorType('crown')}
        onMouseLeave={() => setCursorType('default')}
      >
        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
          <div className="bg-void px-4">
            <Crown 
              size={40} 
              className="text-yellow-400"
              style={{ filter: 'drop-shadow(0 0 10px #ffd700)' }}
            />
          </div>
        </div>

        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0, 212, 255, 0.08) 0%, transparent 70%)',
            animation: 'pulse 3s ease-in-out infinite',
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-square border-2 border-yellow-500/30 bg-gradient-to-br from-void via-void to-blue-950/20 flex items-center justify-center">
              <div className="text-center">
                <div 
                  className="text-8xl font-comic tracking-wider mb-4"
                  style={{ textShadow: '0 0 30px #00d4ff' }}
                >
                  ?
                </div>
                <p className="text-xs tracking-widest text-gray-500">PRODUCER PORTRAIT</p>
              </div>
            </div>

            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-yellow-400" />
            <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-yellow-400" />
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-yellow-400" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-yellow-400" />
          </div>

          <div className="space-y-6">
            <div>
              <h2 
                className="text-4xl md:text-5xl font-comic tracking-wider"
                style={{ textShadow: '0 0 20px #39ff14' }}
              >
                ANDREW
              </h2>
              <p className="text-neon-blue tracking-[0.5em] text-sm mt-2">
                MILLER
              </p>
            </div>

            <div className="space-y-3 border border-white/10 p-6">
              <h3 className="text-xs tracking-widest text-gray-500 mb-4">SKILLS</h3>
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-4">
                  <span className="text-xs tracking-wider w-20">{stat.label}</span>
                  <div className="flex-1 stat-bar">
                    <div 
                      className="stat-bar-fill"
                      style={{ 
                        width: '100%',
                        background: '#ffd700',
                        boxShadow: '0 0 10px #ffd700',
                      }}
                    />
                  </div>
                  <span className="text-xs w-8 text-right text-yellow-400 font-bold">{stat.value}/10</span>
                </div>
              ))}
            </div>

            <div className="border border-neon-blue/30 p-4">
              <p className="text-xs tracking-widest text-neon-blue mb-2">SPECIAL MOVE</p>
              <p className="text-sm tracking-wide text-gray-300">
                From Bournemouth,UK,Born in 95, picked up my first instrument around 8 or 9, started making beats when I was 17 and started focusing on mixing and mastering in the past 5 years, I am extremely passionate about music as I have always been.
              </p>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed tracking-wide">
              Producer and beatmaker specializing in hip hop and grime instrumentals. 
              Every track is handcrafted from scratch with zero generative AI and 
              zero sample clearance issues. Exclusive licenses only — once you buy it, 
              it's yours and yours alone.
            </p>

            <div className="flex gap-4">
              <a 
                href="#" 
                className="p-3 border border-white/20 hover:border-neon-blue hover:text-neon-blue transition-colors"
                onMouseEnter={() => setCursorType('buy')}
                onMouseLeave={() => setCursorType('crown')}
              >
                <Instagram size={18} />
              </a>
              <a 
                href="#" 
                className="p-3 border border-white/20 hover:border-red-400 hover:text-red-400 transition-colors"
                onMouseEnter={() => setCursorType('buy')}
                onMouseLeave={() => setCursorType('crown')}
              >
                <Youtube size={18} />
              </a>
              <a 
                href="#" 
                className="p-3 border border-white/20 hover:border-neon-green hover:text-neon-green transition-colors"
                onMouseEnter={() => setCursorType('buy')}
                onMouseLeave={() => setCursorType('crown')}
              >
                <Globe size={18} />
              </a>
            </div>

            <div className="flex flex-wrap gap-2 pt-4">
              <span className="px-3 py-1 border border-neon-green/30 text-neon-green text-[10px] tracking-wider">
                ✓ NO AI
              </span>

              <span className="px-3 py-1 border border-neon-blue/30 text-neon-blue text-[10px] tracking-wider">
                ✓ EXCLUSIVE ONLY
              </span>
              <span className="px-3 py-1 border border-neon-blue/30 text-neon-blue text-[10px] tracking-wider">
                ✓ HUMAN MADE
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
