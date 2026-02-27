import { Camera } from 'lucide-react';

interface StartPageProps {
  onStart: () => void;
}

export function StartPage({ onStart }: StartPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5e6d3] relative overflow-hidden">
      {/* Vintage texture overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIgLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjMiLz48L3N2Zz4=')]" aria-hidden="true"></div>

      <main className="text-center z-10" aria-label="Vintage Photobooth — welcome screen">
        {/* Vintage Camera Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 border-4 border-[#8b4513] rounded-lg bg-[#d4a574] shadow-2xl flex items-center justify-center rotate-2 group hover:bg-[#c09563] transition-colors duration-300">
              <Camera className="w-16 h-16 text-[#8b4513] group-hover:text-[#654321] transition-colors duration-300" strokeWidth={2.5} />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#8b4513] rounded-full border-2 border-[#f5e6d3]"></div>

            {/* Butterfly sticker */}
            <div className="absolute -top-6 -right-8 transform rotate-12 animate-float">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Butterfly wings */}
                <path d="M30 30 Q20 15, 10 20 Q5 25, 10 30 Q15 35, 30 30" fill="#d4a574" stroke="#8b4513" strokeWidth="1.5" />
                <path d="M30 30 Q40 15, 50 20 Q55 25, 50 30 Q45 35, 30 30" fill="#d4a574" stroke="#8b4513" strokeWidth="1.5" />
                <path d="M30 30 Q20 45, 10 40 Q5 35, 10 30 Q15 25, 30 30" fill="#c09563" stroke="#8b4513" strokeWidth="1.5" />
                <path d="M30 30 Q40 45, 50 40 Q55 35, 50 30 Q45 25, 30 30" fill="#c09563" stroke="#8b4513" strokeWidth="1.5" />
                {/* Body */}
                <ellipse cx="30" cy="30" rx="2" ry="8" fill="#8b4513" />
                {/* Antenna */}
                <path d="M30 22 Q28 18, 27 16" stroke="#8b4513" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                <path d="M30 22 Q32 18, 33 16" stroke="#8b4513" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                <circle cx="27" cy="16" r="1.5" fill="#8b4513" />
                <circle cx="33" cy="16" r="1.5" fill="#8b4513" />
              </svg>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl mb-4 text-[#8b4513] font-serif tracking-wider px-4" style={{ fontFamily: 'Georgia, serif' }}>
          PHOTOBOOTH
        </h1>

        <p className="text-lg sm:text-xl text-[#a0826d] mb-12 font-serif italic px-4">
          Capture memories, vintage style
        </p>

        {/* Start Button */}
        <button
          onClick={onStart}
          aria-label="Start the photobooth"
          className="px-12 py-4 bg-[#8b4513] text-[#f5e6d3] text-xl font-serif tracking-widest
                     border-4 border-[#654321] shadow-lg hover:bg-[#654321] 
                     transition-all duration-300 hover:scale-105 active:scale-95
                     relative overflow-hidden group rounded-lg
                     focus:outline-none focus:ring-4 focus:ring-[#8b4513] focus:ring-offset-2"
        >
          <span className="relative z-10">START</span>
        </button>

        {/* Decorative elements */}
        <div className="mt-8 flex items-center justify-center gap-4" aria-hidden="true">
          <div className="w-16 h-0.5 bg-[#a0826d]"></div>
          <div className="w-2 h-2 bg-[#a0826d] rotate-45"></div>
          <div className="w-16 h-0.5 bg-[#a0826d]"></div>
        </div>
      </main>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-[#8b4513] opacity-40" aria-hidden="true"></div>
      <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-[#8b4513] opacity-40" aria-hidden="true"></div>
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-[#8b4513] opacity-40" aria-hidden="true"></div>
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-[#8b4513] opacity-40" aria-hidden="true"></div>
    </div>
  );
}