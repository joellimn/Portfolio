/** Set once the intro has started, so a refresh in the same tab skips it.
 * The root layout's inline script reads the same key before first paint. */
export const OPENING_SEEN_KEY = "opening-seen";
export const OPENING_SEEN_ATTR = "data-opening-seen";
