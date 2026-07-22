'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BeatGrid } from '@/components/BeatGrid';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

gsap.registerPlugin(ScrollTrigger);

const HeroScene = dynamic(() => import('@/components/3d/HeroScene').then(mod => ({ default: mod.HeroScene })), {
  ssr: false,
});

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (featuredRef.current) {
      gsap.fromTo(
        featuredRef.current.querySelectorAll('.beat-card'),
        { rotateY: 90, opacity: 0 },
        {
          rotateY: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: featuredRef.current,
            start: 'top 80%',
          },
        }
      );
    }
  }, []);

  return (
    <main className="relative">
      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <HeroScene />
        <div className="relative z-10 text-center">
          <h1 
            className="text-7xl md:text-9xl font-comic tracking-wider text-ink mb-4"
            style={{ textShadow: '0 0 30px #00d4ff, 0 0 60px #00d4ff40' }}
          >
            MILLERS
          </h1>
          <p className="text-lg md:text-xl tracking-[0.5em] text-gray-400 mb-8">
            BEAT STORE
          </p>
          <div className="flex gap-4 justify-center">
            <a 
              href="#beats" 
              className="px-8 py-4 border-2 border-neon-green text-neon-green font-bold tracking-widest hover:bg-neon-green hover:text-void transition-all duration-300 box-glow-green"
            >
              SHOP THE ROSTER
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-ink rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-neon-blue rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Featured Beats */}
      <section id="beats" ref={featuredRef} className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-comic tracking-wider text-center mb-4">
            SELECT YOUR <span className="text-neon-blue text-glow-blue">SOUND</span>
          </h2>
          <p className="text-center text-gray-500 tracking-widest mb-12">
            NO AI. ALL GAS.
          </p>
          <BeatGrid />
        </div>
      </section>

      <Footer />
    </main>
  );
}
