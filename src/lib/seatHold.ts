// Per-trip cache of the seats this browser is currently holding, so a returning user can
// instantly see and pay for their selection. The server's `mine` flag remains authoritative;
// this is a fast, resilient fallback that survives the login redirect. TTL matches the 5-min hold.

const HOLD_TTL_MS = 5 * 60 * 1000;

const key = (tripId: string) => `tc_hold_${tripId}`;

interface StoredHold {
  seatNumbers: string[];
  expiresAt: number;
}

export function saveHold(tripId: string, seatNumbers: string[], expiresAtMs?: number): void {
  if (typeof window === 'undefined') return;
  if (!seatNumbers.length) {
    clearHold(tripId);
    return;
  }
  const payload: StoredHold = { seatNumbers, expiresAt: expiresAtMs ?? Date.now() + HOLD_TTL_MS };
  localStorage.setItem(key(tripId), JSON.stringify(payload));
}

export function loadHold(tripId: string): string[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(key(tripId));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as StoredHold;
    if (!parsed?.expiresAt || parsed.expiresAt < Date.now()) {
      clearHold(tripId);
      return [];
    }
    return Array.isArray(parsed.seatNumbers) ? parsed.seatNumbers : [];
  } catch {
    clearHold(tripId);
    return [];
  }
}

export function clearHold(tripId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key(tripId));
}
