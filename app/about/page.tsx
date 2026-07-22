import { Metadata } from 'next';
import { AboutMeCard } from '@/components/AboutMeCard';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'About Me — MILLERS',
  description: 'Meet the producer behind MILLERS and learn more about the sound.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-20">
      <Navbar />
      <AboutMeCard />
      <Footer />
    </main>
  );
}
