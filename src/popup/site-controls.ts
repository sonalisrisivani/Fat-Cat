import { isState, request, siteFromUrl } from '../shared/settings.ts';
import type { State } from '../shared/settings.ts';

export function initializeSiteControls(): void {
  const toggle = document.querySelector<HTMLButtonElement>('#site-toggle')!;
  const label = document.querySelector<HTMLElement>('#site-label')!;
  const status = document.querySelector<HTMLElement>('#page-status')!;
  let site: string | null = null;
  let tabId: number | undefined;
  let state: State | undefined;
  let busy = true;
  const shown = () => state?.allowed === true && !state.hidden && !state.paused;
  function render(): void {
    toggle.disabled = busy || !state || !site || tabId === undefined;
    toggle.textContent = shown() ? 'Hide cat' : 'Show cat';
    toggle.setAttribute('aria-busy', String(busy));
  }
  async function refresh(): Promise<void> {
    const result = await request({ type: 'state', site });
    if (!isState(result)) throw new Error('Invalid settings');
    state = result;
  }
  toggle.addEventListener('click', () => {
    if (busy || !site || !state || tabId === undefined) return;
    const selectedSite = site;
    const selectedTab = tabId;
    const hiding = shown();
    // Keep Chrome's optional permission request in the direct user gesture.
    const permission = !hiding && !state.allowed
      ? chrome.permissions.request({ origins: [`${selectedSite}/*`] })
      : Promise.resolve(true);
    busy = true;
    render();
    void (async () => {
      try {
        if (!await permission) {
          status.textContent = 'Site access wasn’t allowed. Click Show cat to try again.';
          await refresh();
          return;
        }
        if (hiding) {
          await request({ type: 'hidden', site: selectedSite, value: true });
          status.textContent = 'Hidden on this website. Your choice is saved.';
        } else {
          await request({ type: 'reconcile' });
          await request({ type: 'show', site: selectedSite });
          try {
            await chrome.scripting.executeScript({ target: { tabId: selectedTab, frameIds: [0] }, files: ['content/content.js'], world: 'ISOLATED' });
            status.textContent = 'Your cat will return whenever you visit this website.';
          } catch {
            status.textContent = 'Saved. Refresh this webpage to see your cat.';
          }
        }
        await refresh();
      } catch {
        status.textContent = 'Couldn’t update your cat. Close this popup and try again.';
        try { await refresh(); } catch { state = undefined; }
      } finally { busy = false; render(); }
    })();
  });
  render();
  void (async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      site = tab?.incognito ? null : siteFromUrl(tab?.url);
      tabId = tab?.id;
      label.textContent = site ? new URL(site).hostname : 'This page isn’t supported';
      if (!site || tabId === undefined) {
        status.textContent = 'Open a regular website to show your cat.';
        return;
      }
      await refresh();
      status.textContent = shown() ? 'Your cat is enabled on this website.' : 'Show your cat here. We’ll remember for next time.';
    } catch {
      status.textContent = 'Couldn’t load your settings. Close this popup and try again.';
    } finally { busy = false; render(); }
  })();
}
