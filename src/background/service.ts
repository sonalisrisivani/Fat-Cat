import { hasSiteAccess, isRequest, readSite, siteFromUrl } from '../shared/settings.ts';
import type { Request, State } from '../shared/settings.ts';

export async function broadcast(revokedOrigins: string[] = []): Promise<void> {
  const tabs = await chrome.tabs.query({});
  await Promise.allSettled(tabs.filter((tab) => tab.id !== undefined).map((tab) =>
    chrome.tabs.sendMessage(tab.id!, { type: 'settings-changed', revokedOrigins }, { frameId: 0 })));
}

export async function reconcile(): Promise<void> {
  const { origins = [] } = await chrome.permissions.getAll();
  const matches = [...new Set(origins.flatMap((origin) => {
    if (origin === '<all_urls>') return ['http://*/*', 'https://*/*'];
    if (origin.startsWith('*://')) return ['http:' + origin.slice(2), 'https:' + origin.slice(2)];
    return /^https?:\/\//.test(origin) ? [origin] : [];
  }))];
  const [existing] = await chrome.scripting.getRegisteredContentScripts({ ids: ['fat-cat-sites'] });
  if (!matches.length) {
    if (existing) await chrome.scripting.unregisterContentScripts({ ids: ['fat-cat-sites'] });
    return;
  }
  const script: chrome.scripting.RegisteredContentScript = {
    id: 'fat-cat-sites', matches, js: ['content/content.js'],
    runAt: 'document_idle', allFrames: false, persistAcrossSessions: true, world: 'ISOLATED',
    excludeMatches: ['https://chromewebstore.google.com/*', 'https://chrome.google.com/webstore/*'],
  };
  if (existing) await chrome.scripting.updateContentScripts([script]);
  else await chrome.scripting.registerContentScripts([script]);
}

export function authorize(message: Request, sender: chrome.runtime.MessageSender): void {
  if (sender.id !== chrome.runtime.id || sender.tab?.incognito) throw new Error('Invalid sender');
  if (!sender.tab && sender.url === chrome.runtime.getURL('popup/index.html')) return;
  if (message.type === 'show') throw new Error('Only the popup can show a site');
  if (!sender.tab || sender.frameId !== 0 || !('site' in message)
    || !message.site || siteFromUrl(sender.url) !== message.site) throw new Error('Invalid content request');
}

export async function handle(message: unknown, sender: chrome.runtime.MessageSender): Promise<unknown> {
  if (!isRequest(message)) throw new Error('Invalid request');
  authorize(message, sender);
  if (message.type === 'reconcile') { await reconcile(); await broadcast(); return null; }
  if (message.type === 'paused') {
    await chrome.storage.local.set({ paused: message.value });
    await broadcast();
    return null;
  }
  const key = `site:${message.site}`;
  const stored = await chrome.storage.local.get(['paused', key]);
  const settings = readSite(stored[key]);
  if (message.type === 'state') {
    const { origins = [] } = await chrome.permissions.getAll();
    return { ...settings, paused: stored.paused === true && settings.resumeWhilePaused !== true, allowed: message.site !== null && hasSiteAccess(message.site, origins) } satisfies State;
  }
  if (message.type === 'show') {
    const { origins = [] } = await chrome.permissions.getAll();
    if (!hasSiteAccess(message.site, origins)) throw new Error('Site permission is required');
    settings.hidden = false;
    // Recover an old global pause only for the explicitly selected website.
    if (stored.paused === true) settings.resumeWhilePaused = true;
  } else if (message.type === 'hidden') settings.hidden = message.value;
  else settings.position = message.value;
  await chrome.storage.local.set({ [key]: { version: 1, ...settings } });
  if (message.type === 'hidden' || message.type === 'show') await broadcast();
  return null;
}
