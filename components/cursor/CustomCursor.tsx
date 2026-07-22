'use client';

import { useEffect, useRef, useState } from 'react';
import { useCursorStore } from '@/lib/store';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailsRef = useRef<HTMLDivElement[]>([]);
  const cursorType = useCursorStore((s) => s.cursorType);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
    }
  }, [position]);

  const getCursorContent = () => {
    switch (cursorType) {
      case 'needle':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <line x1="12" y1="2" x2="12" y2="18" stroke="#00d4ff" strokeWidth="2" />
            <circle cx="12" cy="20" r="3" stroke="#00d4ff" strokeWidth="2" fill="none" />
          </svg>
        );
      case 'buy':
        return (
          <div className="px-2 py-1 bg-neon-green text-void text-[10px] font-bold tracking-wider">
            BUY
          </div>
        );
      case 'x':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <line x1="2" y1="2" x2="18" y2="18" stroke="#ff3333" strokeWidth="3" />
            <line x1="18" y1="2" x2="2" y2="18" stroke="#ff3333" strokeWidth="3" />
          </svg>
        );
      case 'sword':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 20L20 4" stroke="#00d4ff" strokeWidth="2" />
            <path d="M20 4L16 4" stroke="#00d4ff" strokeWidth="2" />
            <path d="M20 4L20 8" stroke="#00d4ff" strokeWidth="2" />
          </svg>
        );
      case 'crown':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2 14L5 6L10 10L15 6L18 14H2Z" stroke="#ffd700" strokeWidth="2" fill="none" />
            <circle cx="5" cy="6" r="1.5" fill="#39ff14" />
            <circle cx="10" cy="10" r="1.5" fill="#39ff14" />
            <circle cx="15" cy="6" r="1.5" fill="#39ff14" />
          </svg>
        );
      default:
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 3L19 12L12 13L9 21L5 3Z" stroke="#f0f0f0" strokeWidth="2" fill="none" />
          </svg>
        );
    }
  };

  return (
    <>
      {/* Trail ghosts */}
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) trailsRef.current[i] = el;
          }}
          className="fixed top-0 left-0 pointer-events-none z-[9998] opacity-0"
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            transition: `transform ${0.05 * (i + 1)}s ease-out`,
          }}
        >
          <div className="opacity-30">
            {getCursorContent()}
          </div>
        </div>
      ))}

      {/* Main cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: 'transform 0.05s ease-out',
        }}
      >
        {getCursorContent()}
      </div>
    </>
  );
}
