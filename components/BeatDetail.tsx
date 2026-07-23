'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Pause, ShoppingCart, Share2, ArrowLeft } from 'lucide-react';
import { Beat } from '@/types';
import { formatPrice, getBeatStats } from '@/lib/utils';
import { useCurrencyPreference, currencyOptions, useConvertedPrice } from '@/lib/currency';
import { useAudioStore, useCursorStore } from '@/lib/store';

interface BeatDetailProps {
  beat: Beat;
}

export function BeatDetail({ beat }: BeatDetailProps) {
  const [selectedLicense, setSelectedLicense] = useState<'wav' | 'stems'>('wav');
  const { currentBeat, isPlaying, setCurrentBeat, togglePlay } = useAudioStore();
  const setCursorType = useCursorStore((s) => s.setCursorType);
  const { activeCurrency, selectedCurrency, setSelectedCurrency, locale } = useCurrencyPreference();
  const convertedWav = useConvertedPrice(beat.priceWav);
  const convertedStems = useConvertedPrice(beat.priceStems);
  const stats = getBeatStats(beat);
  const isCurrentBeat = currentBeat?.id === beat.id;
  const isPlayingThis = isCurrentBeat && isPlaying;

  const handlePlay = () => {
    if (isCurrentBeat) {
      togglePlay();
    } else {
      setCurrentBeat(beat);
    }
  };

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setCheckoutError(null);
    setIsCheckingOut(true);
    try {
      const priceId = selectedLicense === 'wav' ? beat.stripeWavId : beat.stripeStemsId;

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          beatId: beat.id,
          licenseType: selectedLicense,
          priceId,
          slug: beat.slug,
          currency: activeCurrency,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');
      if (data.url) window.location.href = data.url;
    } catch (err: any) {
      setCheckoutError(err.message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const statLabels = ['VIBE', 'GROOVE', 'BASS', 'ENERGY'];
  const statValues = [stats.vibe, stats.groove, stats.bass, stats.energy];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      {/* Back link */}
      <Link 
        href="/beats" 
        className="inline-flex items-center gap-2 text-sm tracking-wider text-gray-500 hover:text-neon-blue transition-colors mb-8"
      >
        <ArrowLeft size={16} /> BACK TO ROSTER
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Artwork */}
        <div className="relative aspect-square border-2 border-ink overflow-hidden">
          <Image
            src={beat.artworkUrl || '/images/placeholder-beat.jpg'}
            alt={beat.title}
            fill
            className="object-cover"
            priority
          />

          {beat.isSold && (
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
              <div className="wood-sign px-6 py-3 transform -rotate-3">
                <span 
                  className="text-2xl font-comic tracking-widest"
                  style={{ 
                    color: '#39ff14',
                    textShadow: '0 0 20px #39ff14, 0 0 40px #39ff14, 3px 3px 6px rgba(0,0,0,0.8)',
                  }}
                >
                  SOLD
                </span>
              </div>
            </div>
          )}

          {/* Play overlay */}
          <button
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity"
            onMouseEnter={() => setCursorType('buy')}
            onMouseLeave={() => setCursorType('default')}
          >
            <div className="w-24 h-24 border-4 border-neon-blue rounded-full flex items-center justify-center hover:bg-neon-blue/20 transition-colors">
              {isPlayingThis ? (
                <Pause size={40} className="text-neon-blue" />
              ) : (
                <Play size={40} className="text-neon-blue ml-2" />
              )}
            </div>
          </button>
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-comic tracking-wider mb-2">
              {beat.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm tracking-wider text-gray-400">
              <span className="text-neon-blue">{beat.genre.toUpperCase()}</span>
              <span>BPM: {beat.bpm}</span>
              <span>KEY: {beat.musicalKey}</span>
              <span>{beat.mood.join(' / ').toUpperCase()}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="border border-white/10 p-6 space-y-3">
            <h3 className="text-xs tracking-widest text-gray-500 mb-4">SONG STATS</h3>
            {statLabels.map((label, i) => (
              <div key={label} className="flex items-center gap-4">
                <span className="text-xs tracking-wider w-20">{label}</span>
                <div className="flex-1 stat-bar">
                  <div 
                    className="stat-bar-fill"
                    style={{ width: `${statValues[i] * 10}%` }}
                  />
                </div>
                <span className="text-xs w-8 text-right">{statValues[i]}/10</span>
              </div>
            ))}
          </div>

          {/* Description */}
          <p className="text-gray-400 text-sm leading-relaxed tracking-wide">
            {beat.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {beat.tags.map((tag) => (
              <span 
                key={tag} 
                className="px-3 py-1 border border-white/20 text-xs tracking-wider text-gray-400"
              >
                #{tag.toUpperCase()}
              </span>
            ))}
          </div>

          {/* License Selection */}
          {!beat.isSold && (
            <div className="space-y-4">
              <h3 className="text-xs tracking-widest text-gray-500">SELECT LICENSE</h3>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedLicense('wav')}
                  className={`p-6 border-2 text-left transition-all ${
                    selectedLicense === 'wav'
                      ? 'border-neon-green box-glow-green'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <div className="text-2xl font-bold text-neon-green mb-1">
                    {convertedWav !== null
                      ? formatPrice(convertedWav, activeCurrency, locale)
                      : '...'}
                  </div>
                  <div className="text-xs tracking-wider text-gray-400">.WAV LICENSE</div>
                  <div className="text-[10px] text-gray-600 mt-2">
                    High-quality WAV file<br />
                    Exclusive rights
                  </div>
                </button>

                <button
                  onClick={() => setSelectedLicense('stems')}
                  className={`p-6 border-2 text-left transition-all ${
                    selectedLicense === 'stems'
                      ? 'border-neon-green box-glow-green'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <div className="text-2xl font-bold text-neon-green mb-1">
                    {convertedStems !== null
                      ? formatPrice(convertedStems, activeCurrency, locale)
                      : '...'}
                  </div>
                  <div className="text-xs tracking-wider text-gray-400">.WAV + STEMS</div>
                  <div className="text-[10px] text-gray-600 mt-2">
                    WAV + individual stems<br />
                    Exclusive rights
                  </div>
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 rounded border border-white/10 bg-white/5 px-3 py-2 text-xs tracking-wider text-gray-400">
                <span>DISPLAY CURRENCY</span>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value as 'auto' | 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY')}
                  className="rounded border border-white/10 bg-void px-2 py-1 text-xs text-neon-blue"
                >
                  <option value="auto">AUTO ({activeCurrency})</option>
                  {currencyOptions.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buy Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-4 bg-neon-green text-void font-bold tracking-[0.3em] text-lg hover:brightness-110 transition-all box-glow-green flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                onMouseEnter={() => setCursorType('buy')}
                onMouseLeave={() => setCursorType('default')}
              >
                {isCheckingOut ? (
                  <>PROCESSING...</>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    BUY {selectedLicense === 'wav' ? '.WAV' : '.WAV + STEMS'}
                  </>
                )}
              </button>

              {checkoutError && (
                <p className="text-center text-xs text-red-400 tracking-wider">
                  {checkoutError}
                </p>
              )}

              <p className="text-center text-xs text-gray-600 tracking-wider">
                SECURE CHECKOUT VIA STRIPE • INSTANT DELIVERY
              </p>
            </div>
          )}

          {/* Share */}
          <button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-neon-blue transition-colors"
          >
            <Share2 size={14} /> COPY LINK
          </button>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
            <span className="px-3 py-1 border border-neon-green/30 text-neon-green text-[10px] tracking-wider">
              ✓ NO AI
            </span>

            <span className="px-3 py-1 border border-neon-blue/30 text-neon-blue text-[10px] tracking-wider">
              ✓ EXCLUSIVE
            </span>
            <span className="px-3 py-1 border border-neon-blue/30 text-neon-blue text-[10px] tracking-wider">
              ✓ INSTANT DL
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
