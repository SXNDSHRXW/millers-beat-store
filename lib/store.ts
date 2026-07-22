'use client';

import { create } from 'zustand';
import { Beat } from '@/types';

interface AudioState {
  currentBeat: Beat | null;
  isPlaying: boolean;
  volume: number;
  setCurrentBeat: (beat: Beat | null) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  currentBeat: null,
  isPlaying: false,
  volume: 0.8,
  setCurrentBeat: (beat) => set({ currentBeat: beat, isPlaying: !!beat }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setVolume: (volume) => set({ volume }),
}));

interface CartState {
  items: { beat: Beat; licenseType: 'wav' | 'stems' }[];
  addItem: (beat: Beat, licenseType: 'wav' | 'stems') => void;
  removeItem: (beatId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (beat, licenseType) =>
    set((state) => ({
      items: [...state.items.filter((i) => i.beat.id !== beat.id), { beat, licenseType }],
    })),
  removeItem: (beatId) =>
    set((state) => ({
      items: state.items.filter((i) => i.beat.id !== beatId),
    })),
  clearCart: () => set({ items: [] }),
}));

interface CursorState {
  cursorType: 'default' | 'needle' | 'buy' | 'x' | 'sword' | 'crown';
  setCursorType: (type: CursorState['cursorType']) => void;
}

export const useCursorStore = create<CursorState>((set) => ({
  cursorType: 'default',
  setCursorType: (type) => set({ cursorType: type }),
}));
