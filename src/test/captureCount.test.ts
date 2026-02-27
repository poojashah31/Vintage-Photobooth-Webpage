import { describe, it, expect } from 'vitest';
import { LayoutType } from '../App';

/**
 * Utility function: returns the number of photos required for a given layout.
 * Mirrors the logic in CameraPage.tsx: layout === 'A' ? 3 : layout === 'B' ? 4 : 2
 */
function getCaptureCountForLayout(layout: LayoutType): number {
    if (layout === 'A') return 3;
    if (layout === 'B') return 4;
    return 2; // layout === 'C' or null defaults to 2
}

describe('getCaptureCountForLayout', () => {
    it('returns 3 for Classic Strip (Layout A)', () => {
        expect(getCaptureCountForLayout('A')).toBe(3);
    });

    it('returns 4 for Quad Strip (Layout B)', () => {
        expect(getCaptureCountForLayout('B')).toBe(4);
    });

    it('returns 2 for Duo Strip (Layout C)', () => {
        expect(getCaptureCountForLayout('C')).toBe(2);
    });

    it('returns 2 as default when layout is null', () => {
        expect(getCaptureCountForLayout(null)).toBe(2);
    });

    it('total for A, B, C combined is 9', () => {
        const total = (['A', 'B', 'C'] as LayoutType[]).reduce(
            (sum, l) => sum + getCaptureCountForLayout(l),
            0,
        );
        expect(total).toBe(9);
    });
});
