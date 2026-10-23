import { isEligiblePage } from './page-eligibility.ts';
import type { Point } from './position.ts';

export interface SiteSettings { hidden: boolean; position: Point | null; resumeWhilePaused?: boolean }
export interface State extends SiteSettings { paused: boolean; allowed: boolean }
export function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
export function isPosition(value: unknown): value is Point {
  return record(value) && typeof value.x === 'number' && typeof value.y === 'number'
    && Number.isFinite(value.x) && Number.isFinite(value.y)
    && value.x >= 0 && value.x <= 1 && value.y >= 0 && value.y <= 1;
}
export function siteFromUrl(url: string | undefined): string | null {
  if (!isEligiblePage(url)) return null;
  const parsed = new URL(url!);
  return `${parsed.protocol}//${parsed.hostname}`;
}
export function isSite(value: unknown): value is string {
  return typeof value === 'string' && siteFromUrl(value) === value;
}
export function readSite(value: unknown): SiteSettings {
  if (!record(value) || value.version !== 1) return { hidden: false, position: null };
  return { hidden: value.hidden === true, position: isPosition(value.position) ? value.position : null, ...(value.resumeWhilePaused === true ? { resumeWhilePaused: true } : {}) };
}
export function isState(value: unknown): value is State {
  return record(value) && typeof value.paused === 'boolean' && typeof value.allowed === 'boolean'
    && typeof value.hidden === 'boolean' && (value.position === null || isPosition(value.position));
}
export function hasSiteAccess(site: string, origins: string[]): boolean {
  const url = new URL(site);
  return origins.some((pattern) => {
    if (pattern === '<all_urls>') return true;
    const match = /^(https?|\*):\/\/([^/]+)\/\*$/.exec(pattern);
    if (!match || (match[1] !== '*' && `${match[1]}:` !== url.protocol)) return false;
    const host = match[2]!;
    return host === '*' || host === url.hostname
      || (host.startsWith('*.') && (url.hostname === host.slice(2) || url.hostname.endsWith(host.slice(1))));
  });
}
export type Request =
  | { type: 'state'; site: string | null }
  | { type: 'show'; site: string }
  | { type: 'hidden'; site: string; value: boolean }
  | { type: 'position'; site: string; value: Point }
  | { type: 'paused'; value: boolean }
  | { type: 'reconcile' };
export function isRequest(value: unknown): value is Request {
  if (!record(value)) return false;
  switch (value.type) {
    case 'state': return value.site === null || isSite(value.site);
    case 'show': return isSite(value.site);
    case 'hidden': return isSite(value.site) && typeof value.value === 'boolean';
    case 'position': return isSite(value.site) && isPosition(value.value);
    case 'paused': return typeof value.value === 'boolean';
    case 'reconcile': return true;
    default: return false;
  }
}
export async function request(message: Request): Promise<unknown> {
  const response: unknown = await chrome.runtime.sendMessage(message);
  if (!record(response) || response.ok !== true) throw new Error('Could not save or load Fat Cat settings. Try again.');
  return response.value;
}
