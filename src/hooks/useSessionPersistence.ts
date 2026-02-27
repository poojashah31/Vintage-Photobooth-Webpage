/**
 * useSessionPersistence
 *
 * Autosaves the photobooth session to localStorage and restores it on page load.
 *
 * Schema versioning:
 *   - SCHEMA_VERSION is bumped whenever the shape of PersistedSession changes.
 *   - On load, if the stored version doesn't match, the stale data is cleared
 *     and a fresh session starts — no crashes from old field names.
 *
 * Size considerations:
 *   - capturedImages are base64 PNG data-URLs (~300 KB–1 MB each).
 *   - localStorage limit is ~5 MB per origin. With 4 photos × ~500 KB each,
 *     we can hit that limit. All writes are wrapped in try/catch so a
 *     QuotaExceededError silently skips the save rather than crashing the app.
 *   - For production with many photos, consider migrating blobs to IndexedDB.
 */

import { useEffect } from 'react';
import { LayoutType, CapturedImage } from '../App';

// ── Schema ───────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'photobooth_session';
const SCHEMA_VERSION = 1;

export interface PersistedSession {
    version: number;
    timestamp: number;
    currentPage: 'start' | 'layout' | 'camera' | 'results';
    selectedLayout: LayoutType;
    capturedImages: CapturedImage[];
    currentFilter: string;
}

// ── Load ─────────────────────────────────────────────────────────────────────

/**
 * Call this once as the initial value for useState calls in App.tsx.
 * Returns null if no session exists or if the schema version is stale.
 */
export function loadSession(): PersistedSession | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;

        const parsed = JSON.parse(raw) as Partial<PersistedSession>;

        // Schema version mismatch → clear stale data and start fresh
        if (parsed.version !== SCHEMA_VERSION) {
            localStorage.removeItem(STORAGE_KEY);
            console.info('[Photobooth] Cleared stale session (schema version mismatch).');
            return null;
        }

        return parsed as PersistedSession;
    } catch (err) {
        console.warn('[Photobooth] Failed to load session:', err);
        localStorage.removeItem(STORAGE_KEY);
        return null;
    }
}

// ── Save ─────────────────────────────────────────────────────────────────────

function saveSession(session: Omit<PersistedSession, 'version' | 'timestamp'>) {
    try {
        const payload: PersistedSession = {
            version: SCHEMA_VERSION,
            timestamp: Date.now(),
            ...session,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
        // QuotaExceededError — silently skip; the app continues to work fine
        console.warn('[Photobooth] Could not persist session (storage full?):', err);
    }
}

// ── Clear ────────────────────────────────────────────────────────────────────

/** Call when the user clicks "Start Over" to wipe the saved session. */
export function clearSession() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        // No-op — browser might block storage access in private mode
    }
}

// ── Hook ─────────────────────────────────────────────────────────────────────

interface UseSessionPersistenceArgs {
    currentPage: 'start' | 'layout' | 'camera' | 'results';
    selectedLayout: LayoutType;
    capturedImages: CapturedImage[];
    currentFilter: string;
}

/**
 * Autosaves the session whenever any of the tracked values change.
 * Import `loadSession` separately to restore state as useState initialisers.
 */
export function useSessionPersistence({
    currentPage,
    selectedLayout,
    capturedImages,
    currentFilter,
}: UseSessionPersistenceArgs) {
    useEffect(() => {
        // Don't persist the start page — let it always open fresh
        if (currentPage === 'start') return;

        saveSession({ currentPage, selectedLayout, capturedImages, currentFilter });
    }, [currentPage, selectedLayout, capturedImages, currentFilter]);
}
