import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms & Licensing — MILLERS',
  description: 'License terms and conditions for MILLERS beat store.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen pt-20">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12">
        <h1 className="text-4xl md:text-5xl font-comic tracking-wider mb-8">
          TERMS & <span className="text-neon-blue">LICENSE</span>
        </h1>

        <div className="space-y-8 text-gray-400 leading-relaxed">
          <section>
            <h2 className="text-xl font-comic tracking-wider text-ink mb-4">EXCLUSIVE LICENSE</h2>
            <p>
              All beats sold through MILLERS are offered under an exclusive license. 
              Upon purchase, the buyer receives full ownership rights to the instrumental 
              for commercial and non-commercial use. The beat will be marked as sold and 
              removed from the store permanently.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-comic tracking-wider text-ink mb-4">WHAT YOU GET</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>.WAV License: High-quality uncompressed WAV file (44.1kHz, 16-bit or 24-bit)</li>
              <li>.WAV + Stems License: WAV file plus individual stem tracks for mixing</li>
              <li>Full commercial rights — use in songs, videos, performances, streaming</li>
              <li>No royalty splits required</li>
              <li>No attribution required (though credit is appreciated)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-comic tracking-wider text-ink mb-4">NO AI POLICY</h2>
            <p>
              All beats produced by MILLERS are 100% human-made. No artificial intelligence 
              was used in the composition, arrangement, or production of any instrumental 
              available on this store. This guarantee is part of every license.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-comic tracking-wider text-ink mb-4">NO SAMPLE CLEARANCE ISSUES</h2>
            <p>
              All beats are created using original compositions and royalty-free elements. 
              No uncleared samples are used. Buyers will not face sample clearance issues 
              when using these instrumentals.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-comic tracking-wider text-ink mb-4">REFUND POLICY</h2>
            <p>
              Due to the digital nature of the products, all sales are final. No refunds 
              will be issued once files have been delivered. Please preview beats thoroughly 
              before purchasing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-comic tracking-wider text-ink mb-4">CONTACT</h2>
            <p>
              For licensing questions or disputes, contact: beats@millers.store
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
