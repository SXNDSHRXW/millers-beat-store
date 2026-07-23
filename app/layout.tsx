import type { Metadata } from 'next';
import './globals.css';
import { CustomCursor } from '@/components/cursor/CustomCursor';
import { AudioPlayer } from '@/components/AudioPlayer';
import { HalftoneOverlay } from '@/components/HalftoneOverlay';

export const metadata: Metadata = {
  title: 'MILLERS — Beat Store',
  description: 'Exclusive hip hop and grime instrumentals. No AI. All gas.',
  keywords: 'hip hop beats, grime beats, buy beats, exclusive beats, instrumentals, no AI beats',
  openGraph: {
    title: 'MILLERS — Beat Store',
    description: 'Exclusive hip hop and grime instrumentals. No AI. All gas.',
    type: 'website',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MILLERS — Beat Store',
    description: 'Exclusive hip hop and grime instrumentals. No AI. All gas.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-void text-ink min-h-screen">
        <HalftoneOverlay />
        <CustomCursor />
        <AudioPlayer />
        {children}
      </body>
    </html>
  );
}
