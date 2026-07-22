export function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-comic tracking-wider mb-2" style={{ textShadow: '0 0 10px #00d4ff' }}>
              MILLERS
            </h3>
            <p className="text-gray-500 text-sm tracking-widest">
              NO AI. ALL GAS.
            </p>
          </div>

          <div className="flex gap-8 text-sm tracking-widest">
            <a href="/beats" className="hover:text-neon-blue transition-colors">BEATS</a>
            <a href="/about" className="hover:text-neon-blue transition-colors">ABOUT</a>
            <a href="/terms" className="hover:text-gray-400 transition-colors">TERMS</a>
          </div>

          <div className="text-gray-600 text-xs tracking-wider">
            © 2026 MILLERS.
          </div>
        </div>
      </div>
    </footer>
  );
}
