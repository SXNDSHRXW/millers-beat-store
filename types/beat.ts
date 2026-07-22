export interface Beat {
  id: string;
  title: string;
  slug: string;
  bpm: number;
  musicalKey: string;
  genre: string;
  mood: string[];
  tags: string[];
  description: string;
  previewUrl: string;
  artworkUrl: string;
  stripeWavId: string;
  stripeStemsId: string;
  priceWav: number;
  priceStems: number;
  isSold: boolean;
  soldAt: string | null;
  battleWins: number;
  battleLosses: number;
  createdAt: string;
}

export interface BeatStats {
  attack: number;
  defense: number;
  speed: number;
  special: number;
}

export interface Purchase {
  id: string;
  beatId: string;
  stripeSessionId: string;
  customerEmail: string;
  licenseType: 'wav' | 'stems';
  fulfilled: boolean;
  createdAt: string;
}

export interface Battle {
  id: string;
  beatAId: string;
  beatBId: string;
  winnerId: string | null;
  voterIp: string;
  createdAt: string;
}
