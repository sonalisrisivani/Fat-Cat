import { mountCompanion } from './overlay.ts';
import type { Point } from '../shared/position.ts';
import { hasSiteAccess, isState, record, request, siteFromUrl } from '../shared/settings.ts';

interface Controller { refresh: (trial?: boolean, revoked?: boolean) => Promise<void> }
declare global { var __fatCatPageTrial: Controller | undefined }

export function startCompanion(trial: boolean): void {
  const site = siteFromUrl(location.href);
  if (!site) return;
  if (globalThis.__fatCatPageTrial) {
    void globalThis.__fatCatPageTrial.refresh(trial);
    return;
  }
  let teardown: (() => void) | undefined;
  let point: Point | undefined;
  let trialEnabled = trial;
  let revision = 0;
  let locallyHidden = false;
  const remove = () => { teardown?.(); teardown = undefined; };
  const reportFailure = () => console.warn('Fat Cat could not save settings. Reopen the popup to retry.');
  const controller: Controller = {
    async refresh(tryAgain = false, revoked = false) {
      if (tryAgain) { trialEnabled = true; locallyHidden = false; }
      if (revoked) trialEnabled = false;
      const current = ++revision;
      try {
        const state = await request({ type: 'state', site });
        if (current !== revision) return;
        if (!isState(state)) throw new Error('Invalid state');
        if (state.paused || state.hidden || locallyHidden || (!trialEnabled && !state.allowed)) {
          remove();
          return;
        }
        if (teardown) return;
        teardown = mountCompanion(point, (position) => { point = position; }, () => {
          locallyHidden = true;
          remove();
          void request({ type: 'hidden', site, value: true }).catch(reportFailure);
        }, (position) => {
          void request({ type: 'position', site, value: position }).catch(reportFailure);
        }, state.position ?? undefined);
      } catch {
        if (current === revision) remove();
      }
    },
  };
  globalThis.__fatCatPageTrial = controller;
  chrome.runtime.onMessage.addListener((message: unknown, sender) => {
    if (sender.id !== chrome.runtime.id || !record(message) || message.type !== 'settings-changed') return;
    // No async response: worker broadcasts cannot wait on another worker request.
    locallyHidden = false;
    const removed = Array.isArray(message.revokedOrigins) ? message.revokedOrigins.filter((origin): origin is string => typeof origin === 'string') : [];
    void controller.refresh(false, hasSiteAccess(site, removed));
  });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) void controller.refresh();
  });
  window.addEventListener('pageshow', () => { void controller.refresh(); });
  void controller.refresh();
}
