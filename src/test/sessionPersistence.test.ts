import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { loadSession, clearSession, PersistedSession } from '../hooks/useSessionPersistence';

// ── localStorage mock helpers ─────────────────────────────────────────────────

function mockStorage(data: Record<string, string>) {
    const storage: Record<string, string> = { ...data };
    Object.defineProperty(globalThis, 'localStorage', {
        value: {
            getItem: (k: string) => storage[k] ?? null,
            setItem: (k: string, v: string) => { storage[k] = v; },
            removeItem: (k: string) => { delete storage[k]; },
            clear: () => Object.keys(storage).forEach(k => delete storage[k]),
        },
        writable: true,
        configurable: true,
    });
    return storage;
}

describe('useSessionPersistence — loadSession', () => {
    beforeEach(() => mockStorage({}));
    afterEach(() => localStorage.clear());

    it('returns null when localStorage is empty', () => {
        expect(loadSession()).toBeNull();
    });

    it('returns null and clears key when schema version mismatches', () => {
        const stale = { version: 0, timestamp: Date.now(), currentPage: 'camera', selectedLayout: 'A', capturedImages: [], currentFilter: 'none' };
        localStorage.setItem('photobooth_session', JSON.stringify(stale));
        const result = loadSession();
        expect(result).toBeNull();
        expect(localStorage.getItem('photobooth_session')).toBeNull();
    });

    it('returns null and clears key when JSON is malformed', () => {
        localStorage.setItem('photobooth_session', '{ not valid json }}}');
        expect(loadSession()).toBeNull();
        expect(localStorage.getItem('photobooth_session')).toBeNull();
    });

    it('restores a valid v1 session', () => {
        const valid: PersistedSession = {
            version: 1,
            timestamp: 1_700_000_000_000,
            currentPage: 'results',
            selectedLayout: 'B',
            capturedImages: [{ url: 'data:image/png;base64,abc', filter: 'sepia' }],
            currentFilter: 'sepia',
        };
        localStorage.setItem('photobooth_session', JSON.stringify(valid));
        const result = loadSession();
        expect(result).not.toBeNull();
        expect(result?.currentPage).toBe('results');
        expect(result?.selectedLayout).toBe('B');
        expect(result?.currentFilter).toBe('sepia');
        expect(result?.capturedImages).toHaveLength(1);
    });
});

describe('useSessionPersistence — clearSession', () => {
    beforeEach(() => mockStorage({}));

    it('removes the session key from localStorage', () => {
        localStorage.setItem('photobooth_session', '{"version":1}');
        clearSession();
        expect(localStorage.getItem('photobooth_session')).toBeNull();
    });

    it('does not throw when localStorage is already empty', () => {
        expect(() => clearSession()).not.toThrow();
    });
});
