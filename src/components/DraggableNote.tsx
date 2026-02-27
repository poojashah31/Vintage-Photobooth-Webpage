import { useRef, useState, useEffect, useCallback } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { motion, useSpring } from 'motion/react';

interface DraggableNoteProps {
  id: string;
  text: string;
  font: string;
  x: number;
  y: number;
  scale?: number;
  onUpdatePosition: (id: string, x: number, y: number) => void;
  onUpdateScale?: (id: string, scale: number) => void;
  onDelete: (id: string) => void;
}

// Scale bounds — same as DraggableSticker for consistency
const MIN_SCALE = 0.3;
const MAX_SCALE = 4;
// Arrow-key nudge amount in px
const NUDGE_PX = 4;

export function DraggableNote({
  id,
  text,
  font,
  x,
  y,
  scale = 1,
  onUpdatePosition,
  onUpdateScale,
  onDelete,
}: DraggableNoteProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x, y });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const noteRef = useRef<HTMLDivElement>(null);

  // Pinch-to-zoom state
  const [isPinching, setIsPinching] = useState(false);
  const [initialDistance, setInitialDistance] = useState(0);
  const [initialScale, setInitialScale] = useState(scale);

  // Spring animation for smooth bouncy scale effect
  const scaleSpring = useSpring(scale, { stiffness: 300, damping: 20, mass: 0.8 });

  useEffect(() => { setPosition({ x, y }); }, [x, y]);

  useEffect(() => {
    scaleSpring.set(scale);
    setInitialScale(scale);
  }, [scale, scaleSpring]);

  // ── Helpers ──────────────────────────────────────────────────────────────

  const getDistance = (t1: Touch, t2: Touch) => {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const applyScale = useCallback(
    (newScale: number) => {
      const clamped = Math.max(MIN_SCALE, Math.min(newScale, MAX_SCALE));
      scaleSpring.set(clamped);
      if (onUpdateScale) onUpdateScale(id, clamped);
    },
    [id, onUpdateScale, scaleSpring],
  );

  // ── Mouse drag ───────────────────────────────────────────────────────────

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.control-btn')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    e.preventDefault();
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    },
    [isDragging, dragStart],
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onUpdatePosition(id, position.x, position.y);
    }
  }, [isDragging, id, position, onUpdatePosition]);

  useEffect(() => {
    if (!isDragging) return;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // ── Touch drag + pinch-to-zoom ───────────────────────────────────────────

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.control-btn')) return;

    if (e.touches.length === 2) {
      setIsPinching(true);
      setIsDragging(false);
      setInitialDistance(getDistance(e.touches[0], e.touches[1]));
      setInitialScale(parseFloat(scaleSpring.get().toFixed(2)));
      e.preventDefault();
      return;
    }

    if (e.touches.length === 1) {
      const t = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: t.clientX - position.x, y: t.clientY - position.y });
      e.preventDefault();
    }
  };

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (isPinching && e.touches.length === 2) {
        const dist = getDistance(e.touches[0], e.touches[1]);
        applyScale(initialScale * (dist / initialDistance));
        e.preventDefault();
        return;
      }
      if (isDragging && !isPinching && e.touches.length === 1) {
        const t = e.touches[0];
        setPosition({ x: t.clientX - dragStart.x, y: t.clientY - dragStart.y });
        e.preventDefault();
      }
    },
    [isPinching, isDragging, dragStart, initialDistance, initialScale, applyScale],
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (isPinching && e.touches.length < 2) {
        setIsPinching(false);
        setInitialDistance(0);
      }
      if (isDragging && e.touches.length === 0) {
        setIsDragging(false);
        onUpdatePosition(id, position.x, position.y);
      }
      // Finger lifted mid-pinch → resume drag
      if (e.touches.length === 1 && isPinching) {
        setIsPinching(false);
        const t = e.touches[0];
        setIsDragging(true);
        setDragStart({ x: t.clientX - position.x, y: t.clientY - position.y });
      }
    },
    [isPinching, isDragging, id, position, onUpdatePosition],
  );

  useEffect(() => {
    if (!isDragging && !isPinching) return;
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, isPinching, handleTouchMove, handleTouchEnd]);

  // ── Zoom buttons ─────────────────────────────────────────────────────────

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    applyScale(parseFloat(scaleSpring.get().toFixed(2)) + 0.2);
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    applyScale(parseFloat(scaleSpring.get().toFixed(2)) - 0.2);
  };

  // ── Keyboard: Arrow keys nudge, +/- scale, Delete removes ───────────────

  const handleKeyDown = (e: React.KeyboardEvent) => {
    let moved = false;
    let newPos = { ...position };

    switch (e.key) {
      case 'ArrowUp': newPos = { ...newPos, y: newPos.y - NUDGE_PX }; moved = true; break;
      case 'ArrowDown': newPos = { ...newPos, y: newPos.y + NUDGE_PX }; moved = true; break;
      case 'ArrowLeft': newPos = { ...newPos, x: newPos.x - NUDGE_PX }; moved = true; break;
      case 'ArrowRight': newPos = { ...newPos, x: newPos.x + NUDGE_PX }; moved = true; break;
      case '+':
      case '=': applyScale(parseFloat(scaleSpring.get().toFixed(2)) + 0.2); break;
      case '-': applyScale(parseFloat(scaleSpring.get().toFixed(2)) - 0.2); break;
      case 'Delete':
      case 'Backspace': onDelete(id); break;
      default: return;
    }

    if (moved) {
      e.preventDefault();
      setPosition(newPos);
      onUpdatePosition(id, newPos.x, newPos.y);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <motion.div
      ref={noteRef}
      tabIndex={0}
      role="note"
      aria-label={`Draggable note: "${text}" — Arrow keys to move, + / - to resize, Delete to remove`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onKeyDown={handleKeyDown}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        scale: scaleSpring,
        cursor: isDragging ? 'grabbing' : isPinching ? 'zoom-in' : 'grab',
        zIndex: isDragging || isPinching ? 1000 : 10,
        fontFamily: font,
        touchAction: 'none',
        outline: 'none',
      }}
      className="group focus-visible:ring-2 focus-visible:ring-[#8b4513] focus-visible:ring-offset-1 rounded-xl"
      transition={{ type: 'spring', stiffness: 300, damping: 20, mass: 0.8 }}
    >
      <div className="relative bg-white bg-opacity-90 px-4 py-2 rounded-xl border-2 border-[#8b4513] shadow-lg">
        {/* Note text — rendered in selected cursive font for on-strip preview */}
        <p className="text-[#8b4513] text-2xl whitespace-nowrap pointer-events-none select-none">
          {text}
        </p>

        {/* Control buttons — appear on hover or keyboard focus */}
        <div className="control-btn absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 print:hidden">
          <button
            onClick={handleZoomIn}
            aria-label="Zoom note in"
            className="w-7 h-7 bg-blue-500 text-white rounded-full
                       flex items-center justify-center hover:bg-blue-600 shadow-md
                       transition-all duration-200 hover:scale-110"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            aria-label="Zoom note out"
            className="w-7 h-7 bg-blue-500 text-white rounded-full
                       flex items-center justify-center hover:bg-blue-600 shadow-md
                       transition-all duration-200 hover:scale-110"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(id)}
            aria-label="Remove note"
            className="w-7 h-7 bg-red-500 text-white rounded-full
                       flex items-center justify-center hover:bg-red-600 shadow-md
                       transition-all duration-200 hover:scale-110"
            title="Delete (Del)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
