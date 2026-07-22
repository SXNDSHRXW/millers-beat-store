'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Swords, Home, User, Volume2, VolumeX } from 'lucide-react';
import { useCartStore } from '@/lib/store';

export function Navbar() {
  const [isMuted, setIsMuted] = useState(false);
  const items = useCartStore((s) => s.items);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-void/90 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-2xl font-comic tracking-wider hover:text-neon-blue transition-colors"
            style={{ textShadow: '0 0 10px #00d4ff' }}
          >
            MILLERS
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 text-sm tracking-widest hover:text-neon-blue transition-colors">
              <Home size={16} /> HOME
            </Link>
            <Link href="/beats" className="flex items-center gap-2 text-sm tracking-widest hover:text-neon-blue transition-colors">
              <Swords size={16} /> BEATS
            </Link>
            <Link href="/about" className="flex items-center gap-2 text-sm tracking-widest hover:text-neon-blue transition-colors">
              <User size={16} /> ABOUT
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 hover:text-neon-blue transition-colors"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            <Link href="/cart" className="relative p-2 hover:text-neon-green transition-colors">
              <ShoppingBag size={20} />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-neon-green text-void text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {items.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
