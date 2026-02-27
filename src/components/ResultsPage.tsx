import { Download, Printer, RotateCcw, Home, ArrowLeft, StickyNote } from 'lucide-react';
import { LayoutType, CapturedImage } from '../App';
import { useRef, useState } from 'react';
import { DraggableNote } from './DraggableNote';
import { DraggableSticker } from './DraggableSticker';
import butterflyStickerImg from 'figma:asset/2a4a3332fd0eaf2fa25bf3e61a7c19b31cef70cf.png';
import hibiscusBrownImg from 'figma:asset/03ae981efb3a0887fe17adf7f92c21bee98405f8.png';
import goldenFlowerImg from 'figma:asset/f590238576fefd9c24fb354a815dc45e601d2c26.png';
import snoopyImg from 'figma:asset/c7a06596eb83ed1af3024c4e3ccde7559dcb2b65.png';
import hibiscusWhiteImg from 'figma:asset/2b85ea24917805b77812105a65efb729818ec50a.png';

interface ResultsPageProps {
  images: CapturedImage[];
  layout: LayoutType;
  onRestart: () => void;
  onStartOver: () => void;
  onBack: () => void;
}

interface PlacedSticker {
  id: string;
  src: string;
  x: number;
  y: number;
  scale: number;
}

interface PlacedNote {
  id: string;
  text: string;
  font: string;
  x: number;
  y: number;
  scale: number;
}

const stickers = [
  { id: 'butterfly', src: butterflyStickerImg, name: 'Butterfly' },
  { id: 'hibiscus-brown', src: hibiscusBrownImg, name: 'Hibiscus' },
  { id: 'golden-flower', src: goldenFlowerImg, name: 'Golden Flower' },
  { id: 'snoopy', src: snoopyImg, name: 'Snoopy' },
  { id: 'hibiscus-white', src: hibiscusWhiteImg, name: 'White Hibiscus' },
];

export function ResultsPage({ images, layout, onRestart, onStartOver, onBack }: ResultsPageProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [customNote, setCustomNote] = useState('');
  const [selectedFont, setSelectedFont] = useState<string>('Pacifico');
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([]);
  const [placedNotes, setPlacedNotes] = useState<PlacedNote[]>([]);
  const [isSaving, setIsSaving] = useState(false);   // loading state for PNG export

  const cursiveFonts = [
    'Pacifico',
    'Tangerine',
    'Great Vibes',
    'Parisienne',
    'Dancing Script'
  ];

  const handleAddSticker = (stickerSrc: string) => {
    const newSticker: PlacedSticker = {
      id: `sticker-${Date.now()}`,
      src: stickerSrc,
      x: 50,
      y: 50,
      scale: 1,
    };
    setPlacedStickers([...placedStickers, newSticker]);
  };

  const handleAddNote = () => {
    if (!customNote.trim()) return;

    const newNote: PlacedNote = {
      id: `note-${Date.now()}`,
      text: customNote,
      font: selectedFont,
      x: 50,
      y: 200,
      scale: 1,
    };
    setPlacedNotes([...placedNotes, newNote]);
    setCustomNote('');
  };

  const handleUpdateStickerPosition = (id: string, x: number, y: number) => {
    setPlacedStickers(prev =>
      prev.map(sticker => sticker.id === id ? { ...sticker, x, y } : sticker)
    );
  };

  const handleUpdateStickerScale = (id: string, scale: number) => {
    setPlacedStickers(prev =>
      prev.map(sticker => sticker.id === id ? { ...sticker, scale } : sticker)
    );
  };

  const handleUpdateNotePosition = (id: string, x: number, y: number) => {
    setPlacedNotes(prev =>
      prev.map(note => note.id === id ? { ...note, x, y } : note)
    );
  };

  const handleUpdateNoteScale = (id: string, scale: number) => {
    setPlacedNotes(prev =>
      prev.map(note => note.id === id ? { ...note, scale } : note)
    );
  };

  const handleDeleteSticker = (id: string) => {
    setPlacedStickers(prev => prev.filter(sticker => sticker.id !== id));
  };

  const handleDeleteNote = (id: string) => {
    setPlacedNotes(prev => prev.filter(note => note.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = async () => {
    if (!stripRef.current || isSaving) return;

    setIsSaving(true);
    try {
      const html2canvas = (await import('html2canvas')).default;

      // Captured photos are data-URLs (same-origin).
      // Sticker PNGs are bundled by Vite and served same-origin.
      // => useCORS:true is sufficient; allowTaint must be FALSE so
      //    the canvas stays clean and toBlob() can read pixel data.
      const canvas = await html2canvas(stripRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: false,
        imageTimeout: 15000,
      });

      canvas.toBlob((blob) => {
        if (!blob) {
          alert('Error saving image. Please try again.');
          setIsSaving(false);
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `photobooth-strip-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsSaving(false);
      }, 'image/png');
    } catch (error) {
      console.error('Error saving image:', error);
      alert('Error saving image. Please try again.');
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5e6d3] relative overflow-x-hidden">
      {/* Back button */}
      <button
        onClick={onBack}
        className="fixed left-4 top-4 lg:left-8 lg:top-8 w-12 h-12 bg-[#8b4513] text-[#f5e6d3] rounded-full
                   flex items-center justify-center hover:bg-[#654321] transition-all duration-300
                   shadow-lg hover:scale-110 z-50"
        aria-label="Back to layout selection"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="w-full px-4 py-20 lg:py-8">
        {/* Header */}
        <div className="text-center mb-6 lg:mb-8 px-4">
          <h2 className="text-3xl lg:text-5xl text-[#8b4513] font-serif mb-2">
            Save it before the moment escapes
          </h2>
          <p className="text-[#a0826d] font-serif text-base lg:text-lg italic">
            Take this memory with you
          </p>
        </div>

        {/* Main Content Container */}
        <div className="flex flex-col lg:flex-row items-start justify-center gap-6 lg:gap-8 max-w-7xl mx-auto">

          {/* Left/Center Column: Photo Strip */}
          <div className="w-full lg:flex-shrink-0 flex flex-col items-center order-1">
            {/* Photo Strip Container — no extra padding so html2canvas captures exactly the strip */}
            <div className="relative">
              <div
                ref={stripRef}
                className="photo-strip-print bg-white border-8 border-[#8b4513] shadow-2xl p-3 relative"
                style={{
                  width: '320px',
                  height: '960px',
                }}
              >
                <div className="h-full flex flex-col gap-2">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="flex-1 border-4 border-[#a0826d] overflow-hidden bg-black"
                    >
                      <img
                        src={img.url}
                        alt={`Photo ${idx + 1}`}
                        className="w-full h-full object-cover"
                        style={{ transform: 'scaleX(-1)' }}
                      />
                    </div>
                  ))}
                </div>

                {/* Placed Stickers - Draggable */}
                {placedStickers.map((sticker) => (
                  <DraggableSticker
                    key={sticker.id}
                    id={sticker.id}
                    src={sticker.src}
                    x={sticker.x}
                    y={sticker.y}
                    scale={sticker.scale}
                    onUpdatePosition={handleUpdateStickerPosition}
                    onUpdateScale={handleUpdateStickerScale}
                    onDelete={handleDeleteSticker}
                  />
                ))}

                {/* Placed Notes - Draggable */}
                {placedNotes.map((note) => (
                  <DraggableNote
                    key={note.id}
                    id={note.id}
                    text={note.text}
                    font={note.font}
                    x={note.x}
                    y={note.y}
                    scale={note.scale}
                    onUpdatePosition={handleUpdateNotePosition}
                    onUpdateScale={handleUpdateNoteScale}
                    onDelete={handleDeleteNote}
                  />
                ))}
              </div>
            </div>

            {/* Custom Note Input */}
            <div className="w-full max-w-md mt-6 order-3">
              <div className="bg-white border-4 border-[#8b4513] rounded-3xl p-6 shadow-lg">
                <label className="text-[#8b4513] font-serif mb-2 block text-lg flex items-center gap-2">
                  <StickyNote className="w-5 h-5" />
                  Add a Custom Note
                </label>
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Write something special..."
                  className="w-full px-4 py-3 border-2 border-[#a0826d] bg-[#f5e6d3] text-[#8b4513]
                             font-serif focus:outline-none focus:border-[#8b4513] mb-3 rounded-2xl"
                  maxLength={50}
                />

                <label className="text-[#8b4513] font-serif text-sm mb-1 block">
                  Choose Font
                </label>
                <select
                  value={selectedFont}
                  onChange={(e) => setSelectedFont(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#a0826d] bg-[#f5e6d3] text-[#8b4513]
                             font-serif focus:outline-none focus:border-[#8b4513] rounded-2xl mb-3"
                >
                  {cursiveFonts.map((font) => (
                    <option key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleAddNote}
                  disabled={!customNote.trim()}
                  className="w-full px-6 py-3 bg-[#8b4513] text-[#f5e6d3] font-serif
                             border-2 border-[#654321] shadow-lg hover:bg-[#a0522d]
                             transition-all duration-300 hover:scale-105 active:scale-95
                             disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl"
                >
                  Place Note on Strip
                </button>

                {customNote && (
                  <p
                    className="mt-3 text-[#8b4513] text-center text-lg"
                    style={{ fontFamily: selectedFont }}
                  >
                    Preview: {customNote}
                  </p>
                )}
              </div>
            </div>

            {/* Stickers — shown below the note input on all screen sizes */}
            <div className="w-full max-w-md mt-6 order-4">
              <div className="bg-[#d4a574] border-4 border-[#8b4513] rounded-3xl p-6 shadow-lg">
                <h3 className="text-xl text-[#8b4513] font-serif mb-4 text-center">
                  🎨 Add Stickers
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {stickers.map((sticker) => (
                    <button
                      key={sticker.id}
                      onClick={() => handleAddSticker(sticker.src)}
                      aria-label={`Add ${sticker.name} sticker`}
                      className="bg-white border-2 border-[#8b4513] rounded-2xl p-3
                                 hover:scale-105 hover:shadow-lg transition-all duration-300
                                 active:scale-95"
                    >
                      <img
                        src={sticker.src}
                        alt={sticker.name}
                        className="w-full h-16 object-contain"
                        style={{ mixBlendMode: 'multiply' }}
                      />
                      <p className="text-[#8b4513] font-serif text-xs mt-1 text-center">{sticker.name}</p>
                    </button>
                  ))}
                </div>
                <p className="text-[#8b4513] font-serif text-xs text-center mt-3">
                  💡 Tap to place, then drag on the strip to position
                </p>
              </div>
            </div>

            {/* Action buttons — Download PNG + Print */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-6 order-4">
              {/* Download PNG — html2canvas lazy-loaded, 2× scale */}
              <button
                onClick={handleSave}
                disabled={isSaving}
                aria-label="Download photo strip as PNG"
                aria-busy={isSaving}
                className="px-8 py-4 bg-[#8b4513] text-[#f5e6d3] font-serif text-lg
                           border-4 border-[#654321] shadow-lg hover:bg-[#a0522d]
                           transition-all duration-300 hover:scale-105 active:scale-95
                           disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
                           flex items-center gap-3 rounded-3xl"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Saving…
                  </>
                ) : (
                  <>
                    <Download className="w-6 h-6" />
                    Save PNG
                  </>
                )}
              </button>

              {/* Print — window.print() with @media print CSS */}
              <button
                onClick={handlePrint}
                aria-label="Print photo strip"
                className="px-8 py-4 bg-[#8b4513] text-[#f5e6d3] font-serif text-lg
                           border-4 border-[#654321] shadow-lg hover:bg-[#a0522d]
                           transition-all duration-300 hover:scale-105 active:scale-95
                           flex items-center gap-3 rounded-3xl"
              >
                <Printer className="w-6 h-6" />
                Print Strip
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 mt-4 order-5">
              <button
                onClick={onRestart}
                className="w-14 h-14 bg-[#a0826d] text-white rounded-full
                           border-4 border-[#8b4513] shadow-lg hover:bg-[#8b6f47]
                           transition-all duration-300 hover:scale-110 active:scale-95
                           flex items-center justify-center"
                title="Take New Photos"
              >
                <RotateCcw className="w-6 h-6" />
              </button>

              <button
                onClick={onStartOver}
                className="w-14 h-14 bg-white text-[#8b4513] rounded-full
                           border-4 border-[#8b4513] shadow-lg hover:bg-[#f5e6d3]
                           transition-all duration-300 hover:scale-110 active:scale-95
                           flex items-center justify-center"
                title="Start Over"
              >
                <Home className="w-6 h-6" />
              </button>
            </div>

            {/* Decorative elements */}
            <div className="mt-8 flex items-center justify-center gap-4 order-6">
              <div className="w-24 h-0.5 bg-[#a0826d]"></div>
              <div className="w-2 h-2 bg-[#a0826d] rotate-45"></div>
              <div className="text-[#a0826d] font-serif text-sm">VINTAGE MEMORIES</div>
              <div className="w-2 h-2 bg-[#a0826d] rotate-45"></div>
              <div className="w-24 h-0.5 bg-[#a0826d]"></div>
            </div>
          </div>
        </div>
      </div>

      {/*
        Print styles — uses visibility:hidden on the page so nested .photo-strip-print
        can override with visibility:visible. display:none would hide the strip too
        since it is nestled inside the page div tree.
        @page { margin:0 } removes browser default print margins for a clean crop.
      */}
      <style>{`
        @page { margin: 0; size: portrait; }
        @media print {
          html, body { visibility: hidden; }
          .photo-strip-print {
            visibility: visible !important;
            position: fixed !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 320px !important;
            height: 960px !important;
            border: 8px solid #8b4513 !important;
            box-shadow: none !important;
            background: #ffffff !important;
          }
          .photo-strip-print * {
            visibility: visible !important;
          }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}