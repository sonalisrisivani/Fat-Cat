import { isState, request, siteFromUrl } from '../shared/settings.ts';
import { isEligiblePage } from '../shared/page-eligibility.ts';

export async function tryOnCurrentPage(): Promise<string> {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || tab.id === undefined || tab.incognito || !isEligiblePage(tab.url)) {
      return 'Open a regular website first. Chrome pages, the Web Store, files, and incognito aren’t supported.';
    }
    const state = await request({ type: 'state', site: siteFromUrl(tab.url) });
    if (!isState(state)) throw new Error('Invalid state');
    if (state.paused) return 'Resume everywhere before trying on this page.';
    if (state.hidden) return 'Choose Show on this site before trying again.';
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id, frameIds: [0] },
      files: ['content/trial.js'],
      world: 'ISOLATED',
    });
    if (results.length === 0) return 'The page changed. Open the popup on your website and try again.';
    return 'Your cat is on this page. Close this popup to drag or pet it. Use × to hide it.';
  } catch {
    return 'Chrome couldn’t add the cat here. Try a regular website, or reload the page and try again.';
  }
}
