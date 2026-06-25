const GUEST_KEY = 'tc_guest_id';

// A stable per-browser id so guests can hold seats before logging in.
export function getGuestId(): string {
  if (typeof window === 'undefined') return 'server';
  let id = localStorage.getItem(GUEST_KEY);
  if (!id) {
    id = `guest_${crypto.randomUUID()}`;
    localStorage.setItem(GUEST_KEY, id);
  }
  return id;
}
