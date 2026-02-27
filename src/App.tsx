import { useState, useEffect } from 'react';
import { StartPage } from './components/StartPage';
import { LayoutSelection } from './components/LayoutSelection';
import { CameraPage } from './components/CameraPage';
import { ResultsPage } from './components/ResultsPage';
import { loadSession, clearSession, useSessionPersistence } from './hooks/useSessionPersistence';

export type LayoutType = 'A' | 'B' | 'C' | null;

export interface CapturedImage {
  url: string;
  filter: string;
}

// ── Restore session once at boot (before first render) ───────────────────────
const _saved = loadSession();

export default function App() {
  // Initialise from persisted session if available; otherwise use defaults
  const [currentPage, setCurrentPage] = useState<'start' | 'layout' | 'camera' | 'results'>(
    _saved?.currentPage ?? 'start',
  );
  const [selectedLayout, setSelectedLayout] = useState<LayoutType>(
    _saved?.selectedLayout ?? null,
  );
  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>(
    _saved?.capturedImages ?? [],
  );
  const [currentFilter, setCurrentFilter] = useState<string>(
    _saved?.currentFilter ?? 'none',
  );
  const [isFlipping, setIsFlipping] = useState(false);

  // Phase 12: autosave on every state change that matters
  useSessionPersistence({ currentPage, selectedLayout, capturedImages, currentFilter });

  // Phase 4: update browser tab title per page
  useEffect(() => {
    const titles: Record<typeof currentPage, string> = {
      start: '📷 Vintage Photobooth',
      layout: '🖼️ Choose Your Layout — Vintage Photobooth',
      camera: '📸 Strike a Pose! — Vintage Photobooth',
      results: '✨ Your Photo Strip — Vintage Photobooth',
    };
    document.title = titles[currentPage];
  }, [currentPage]);

  // ── Navigation handlers ───────────────────────────────────────────────────

  const handleStart = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage('layout');
      setIsFlipping(false);
    }, 800);
  };

  const handleLayoutSelect = (layout: LayoutType) => {
    setSelectedLayout(layout);
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage('camera');
      setIsFlipping(false);
    }, 800);
  };

  const handleImagesCapture = (images: CapturedImage[]) => {
    setCapturedImages(images);
    setCurrentPage('results');
  };

  const handleRestart = () => {
    setCapturedImages([]);
    setCurrentPage('camera');
  };

  /** Full reset — also clears localStorage session */
  const handleStartOver = () => {
    clearSession();
    setCapturedImages([]);
    setSelectedLayout(null);
    setCurrentFilter('none');
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage('start');
      setIsFlipping(false);
    }, 800);
  };

  const handleBackToHome = () => {
    clearSession();
    setCapturedImages([]);
    setSelectedLayout(null);
    setCurrentFilter('none');
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage('start');
      setIsFlipping(false);
    }, 800);
  };

  const handleBackToLayout = () => {
    setCapturedImages([]);
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage('layout');
      setIsFlipping(false);
    }, 800);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#f5e6d3] overflow-hidden">
      <div className={`transition-all duration-700 ${isFlipping ? 'animate-flip' : ''}`}>
        {currentPage === 'start' && <StartPage onStart={handleStart} />}
        {currentPage === 'layout' && (
          <LayoutSelection onSelectLayout={handleLayoutSelect} onBack={handleBackToHome} />
        )}
        {currentPage === 'camera' && (
          <CameraPage
            layout={selectedLayout}
            onComplete={handleImagesCapture}
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
            onBack={handleBackToLayout}
          />
        )}
        {currentPage === 'results' && (
          <ResultsPage
            images={capturedImages}
            layout={selectedLayout}
            onRestart={handleRestart}
            onStartOver={handleStartOver}
            onBack={handleBackToLayout}
          />
        )}
      </div>
    </div>
  );
}