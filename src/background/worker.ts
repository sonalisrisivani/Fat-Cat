import { broadcast, handle, reconcile } from './service.ts';

// One queue prevents lost updates and registration races within each worker lifetime.
let pending: Promise<unknown> = Promise.resolve();
function enqueue<T>(operation: () => Promise<T>): Promise<T> {
  const result = pending.then(operation);
  pending = result.catch(() => undefined);
  return result;
}
chrome.runtime.onMessage.addListener((message: unknown, sender, respond) => {
  void enqueue(() => handle(message, sender)).then(
    (value) => respond({ ok: true, value }),
    () => respond({ ok: false }),
  );
  return true;
});
function refresh(revokedOrigins: string[] = []): void {
  void enqueue(async () => {
    // Notify even if registration fails: already-injected cats must recheck access.
    try { await reconcile(); } finally { await broadcast(revokedOrigins); }
  }).catch(() => console.warn('Fat Cat could not refresh site access; reopen the popup to retry.'));
}
chrome.permissions.onAdded.addListener(() => refresh());
chrome.permissions.onRemoved.addListener((permissions) => refresh(permissions.origins ?? []));
chrome.runtime.onStartup.addListener(() => refresh());
chrome.runtime.onInstalled.addListener(() => refresh());
