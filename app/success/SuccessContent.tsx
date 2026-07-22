'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Trophy, Mail, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen pt-20">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-20 text-center">
        <div className="mb-8">
          <Trophy
            size={80}
            className="mx-auto text-neon-green"
            style={{ filter: 'drop-shadow(0 0 20px #39ff14)' }}
          />
        </div>

        <h1
          className="text-5xl md:text-7xl font-comic tracking-wider mb-4"
          style={{ textShadow: '0 0 30px #39ff14, 0 0 60px #39ff1440' }}
        >
          K.O.!
        </h1>

        <p className="text-xl tracking-widest text-neon-green mb-2">
          PURCHASE SUCCESSFUL
        </p>

        <p className="text-gray-500 tracking-wider mb-8">
          YOUR BEAT HAS BEEN SECURED
        </p>

        <div className="border border-white/10 p-8 mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mail size={24} className="text-neon-blue" />
            <span className="text-lg tracking-wider">CHECK YOUR INBOX</span>
          </div>
          <p className="text-sm text-gray-400 tracking-wide">
            Your files are being prepared and will arrive via email shortly.
            <br />
            Session ID: <span className="text-neon-blue font-mono">{sessionId?.slice(0, 16)}...</span>
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Link
            href="/beats"
            className="px-8 py-3 border-2 border-neon-blue text-neon-blue font-bold tracking-wider hover:bg-neon-blue/10 transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={18} /> BACK TO BEATS
          </Link>

          <p className="text-xs text-gray-600 tracking-wider">
            Redirecting to beats in {countdown}s...
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-12 pt-8 border-t border-white/10">
          <span className="px-3 py-1 border border-neon-green/30 text-neon-green text-[10px] tracking-wider">
            ✓ EXCLUSIVE LICENSE
          </span>
          <span className="px-3 py-1 border border-neon-green/30 text-neon-green text-[10px] tracking-wider">
            ✓ NO AI
          </span>

        </div>
      </div>
      <Footer />
    </main>
  );
}
