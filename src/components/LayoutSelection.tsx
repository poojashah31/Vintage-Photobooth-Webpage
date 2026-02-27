import { LayoutType } from '../App';
import { ArrowLeft } from 'lucide-react';

interface LayoutSelectionProps {
  onSelectLayout: (layout: LayoutType) => void;
  onBack: () => void;
}

const layouts: {
  id: LayoutType;
  label: string;
  name: string;
  poses: number;
  description: string;
}[] = [
    { id: 'A', label: 'A', name: 'Classic Strip', poses: 3, description: '6×2" strip • 3 poses' },
    { id: 'B', label: 'B', name: 'Quad Strip', poses: 4, description: '6×2" strip • 4 poses' },
    { id: 'C', label: 'C', name: 'Duo Strip', poses: 2, description: '6×2" strip • 2 poses' },
  ];

export function LayoutSelection({ onSelectLayout, onBack }: LayoutSelectionProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5e6d3] p-4 sm:p-8 relative">

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute left-4 top-4 sm:left-8 sm:top-8 w-12 h-12 bg-[#8b4513] text-[#f5e6d3] rounded-full
                   flex items-center justify-center hover:bg-[#654321] transition-all duration-300
                   shadow-lg hover:scale-110 z-20 focus:outline-none focus:ring-4 focus:ring-[#8b4513] focus:ring-offset-2"
        aria-label="Back to home"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      {/* Vintage page texture */}
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIgLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjMiLz48L3N2Zz4=')]" />

      <div className="max-w-6xl w-full z-10 pt-16 sm:pt-0">
        <h2 className="text-3xl sm:text-4xl md:text-5xl text-center mb-4 text-[#8b4513] font-serif tracking-wide px-4">
          Choose Your Layout
        </h2>

        <p className="text-center text-[#a0826d] mb-8 sm:mb-12 text-base sm:text-lg font-serif italic px-4">
          Select a photo strip format
        </p>

        {/* 3-col on desktop, 1-col on mobile — as per DESIGN.md §4.2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" role="list">
          {layouts.map(layout => (
            <button
              key={layout.id}
              role="listitem"
              onClick={() => onSelectLayout(layout.id)}
              aria-label={`Select ${layout.name} — ${layout.poses} poses`}
              className="group relative bg-white p-8 border-4 border-[#8b4513]
                         hover:border-[#654321] transition-all duration-300 hover:scale-105
                         shadow-xl hover:shadow-2xl text-left
                         focus:outline-none focus:ring-4 focus:ring-[#8b4513] focus:ring-offset-2"
            >
              {/* Layout letter badge */}
              <div
                className="absolute top-4 right-4 w-8 h-8 border-2 border-[#8b4513] rounded-full
                           flex items-center justify-center text-[#8b4513] font-serif
                           group-hover:bg-[#8b4513] group-hover:text-[#f5e6d3] transition-colors duration-300"
                aria-hidden="true"
              >
                {layout.label}
              </div>

              <h3 className="text-2xl text-[#8b4513] mb-6 font-serif text-center">
                {layout.name}
              </h3>

              {/* Visual preview — dashed pose slots */}
              <div className="bg-white border-2 border-[#8b4513] p-4 mb-4">
                <div
                  className={`space-y-${layout.poses === 2 ? '4' : layout.poses === 3 ? '3' : '2'}`}
                  aria-hidden="true"
                >
                  {Array.from({ length: layout.poses }, (_, i) => (
                    <div
                      key={i + 1}
                      className="aspect-[4/3] bg-[#f5e6d3] border-2 border-dashed border-[#a0826d]
                                 flex items-center justify-center text-[#a0826d] font-serif text-sm"
                    >
                      Pose {i + 1}
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-center text-[#a0826d] font-serif">{layout.description}</p>
            </button>
          ))}
        </div>

        {/* Decorative divider */}
        <div className="mt-12 flex items-center justify-center gap-4" aria-hidden="true">
          <div className="w-24 h-0.5 bg-[#a0826d]" />
          <div className="w-2 h-2 bg-[#a0826d] rotate-45" />
          <div className="w-24 h-0.5 bg-[#a0826d]" />
        </div>
      </div>
    </div>
  );
}