import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getBeatBySlug } from '@/lib/supabase';
import { BeatDetail } from '@/components/BeatDetail';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const beat = await getBeatBySlug(slug);

  if (!beat) {
    return { title: 'Beat Not Found — MILLERS' };
  }

  return {
    title: `${beat.title} — ${beat.bpm} BPM ${beat.genre} Beat | MILLERS`,
    description: `Buy '${beat.title}' — ${beat.bpm} BPM ${beat.musicalKey} ${beat.genre} instrumental. ${beat.mood.join(', ')} beat. Exclusive license. No AI.`,
    openGraph: {
      title: `${beat.title} — ${beat.bpm} BPM ${beat.genre} Beat`,
      description: `${beat.mood.join(', ')} ${beat.genre} instrumental. Exclusive license.`,
      images: [beat.artworkUrl],
      type: 'music.song',
    },
    twitter: {
      card: 'player',
      title: beat.title,
      description: `${beat.bpm} BPM ${beat.musicalKey} ${beat.genre} beat`,
      images: [beat.artworkUrl],
    },
  };
}

export default async function BeatDetailPage({ params }: Props) {
  const { slug } = await params;
  const beat = await getBeatBySlug(slug);

  if (!beat) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-20">
      <Navbar />
      <BeatDetail beat={beat} />
      <Footer />
    </main>
  );
}
