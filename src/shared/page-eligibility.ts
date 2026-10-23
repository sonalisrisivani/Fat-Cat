export function isEligiblePage(url: string | undefined): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return (parsed.protocol === 'http:' || parsed.protocol === 'https:')
      && parsed.hostname !== 'chromewebstore.google.com'
      && !(parsed.hostname === 'chrome.google.com' && parsed.pathname.startsWith('/webstore'));
  } catch {
    return false;
  }
}
