/**
 * @typedef {{ url: string, slug: string }} Bookmark
 */

/**
 * Convert a web address to its canonical URL, assuming HTTPS when omitted.
 * @param {unknown} value
 * @returns {string | null}
 */
export function normalizeUrl(value) {
  if (typeof value !== 'string' || value.trim() === '') return null;

  const input = value.trim();
  const candidate = /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(input)
    ? input
    : `https://${input}`;

  try {
    const url = new URL(candidate);
    if (!['http:', 'https:'].includes(url.protocol) || !url.hostname) return null;
    return url.toString();
  } catch {
    return null;
  }
}

/**
 * Parse and validate untrusted localStorage data, returning only safe entries.
 * @param {string | null} rawValue
 * @returns {Bookmark[]}
 */
export function parseBookmarks(rawValue) {
  if (typeof rawValue !== 'string' || rawValue.trim() === '') return [];

  try {
    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) return [];

    return parsed.flatMap((entry) => {
      if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) return [];
      const url = normalizeUrl(entry.url);
      if (url === null || typeof entry.slug !== 'string' || !/^mona-[A-Za-z0-9]{4}$/.test(entry.slug)) {
        return [];
      }
      return [{ url, slug: entry.slug }];
    });
  } catch {
    return [];
  }
}

/**
 * @param {Bookmark} bookmark
 * @returns {string}
 */
export function formatBookmark(bookmark) {
  return `${bookmark.url} :: ${bookmark.slug}`;
}
