/**
 * trackView — Increments viewCount on a product or shop document in Firestore.
 *
 * Uses Firestore atomic increment() so concurrent users don't overwrite each other.
 * Debounced per-session via sessionStorage so page refreshes don't inflate counts.
 *
 * @param {'product'|'shop'} type  - The entity type
 * @param {string}           id    - Firestore document ID
 */

import { doc, increment, updateDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';

// Session key: visited entity IDs this tab session (prevents refresh inflation)
const SESSION_KEY = 'mb_viewed_ids';

function getVisitedIds() {
  try {
    return new Set(JSON.parse(sessionStorage.getItem(SESSION_KEY) || '[]'));
  } catch {
    return new Set();
  }
}

function markVisited(uniqueKey) {
  try {
    const ids = getVisitedIds();
    ids.add(uniqueKey);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify([...ids]));
  } catch {
    // sessionStorage unavailable — silently skip
  }
}

/**
 * Call this when a product or shop page is first visited.
 * Will silently no-op if Firebase is not configured or already visited this session.
 */
export async function trackView(type, id) {
  if (!id || !isFirebaseConfigured) return;

  const uniqueKey = `${type}:${id}`;
  const visited = getVisitedIds();
  if (visited.has(uniqueKey)) return; // already counted this session

  markVisited(uniqueKey);

  try {
    const collectionName = type === 'product' ? 'products' : 'shops';
    const ref = doc(db, collectionName, id);
    await updateDoc(ref, {
      viewCount: increment(1),
    });
  } catch (err) {
    // Don't crash if the doc doesn't exist or perms fail — analytics is non-critical
    console.warn(`[trackView] Could not increment viewCount for ${type}:${id}`, err?.code || err?.message);
  }
}
