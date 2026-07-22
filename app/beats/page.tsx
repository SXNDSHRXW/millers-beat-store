import { BeatGrid } from '@/components/BeatGrid';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function BeatsPage() {
  return (
    <main className="min-h-screen pt-20">
      <Navbar />

      <section className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-comic tracking-wider mb-4">
              ROSTER
            </h1>
            <p className="text-sm md:text-base tracking-[0.4em] text-gray-500">
              SELECT YOUR SOUND
            </p>
          </div>

          <BeatGrid />
        </div>
      </section>

      <Footer />
    </main>
  );
}
