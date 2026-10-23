/** Deliberately small JSON format: transforms and opacity, not arbitrary CSS or scripts. */
export const stateNames = ['idle', 'sleeping', 'walking', 'playing', 'petting', 'stretching'] as const;
export type CatState = typeof stateNames[number];
export const partNames = ['shadow', 'cat', 'tail', 'backFoot', 'frontFoot', 'body', 'leftArm', 'rightArm', 'head', 'eyes', 'closedEyes', 'wool', 'heart', 'sleep'] as const;
export type Part = typeof partNames[number];
export type Pose = { transform?: string; opacity?: number };
export type Frame = Pose & { offset?: number };
export type Track = { part: Part; frames: Frame[]; duration: number; loop: boolean; delay: number };
export type Clip = { label: string; caption: string; pose: Partial<Record<Part, Pose>>; tracks: Track[]; returnTo?: CatState };
export type MotionLibrary = Record<CatState, Clip>;
export function isCatState(value: string): value is CatState {
  return (stateNames as readonly string[]).includes(value);
}
function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Expected an object');
  return value as Record<string, unknown>;
}
function part(value: unknown): Part {
  if (typeof value !== 'string' || !(partNames as readonly string[]).includes(value)) throw new Error('Unknown rig part');
  return value as Part;
}
function numeric(value: unknown, min: number, max: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) throw new Error('Number outside motion bounds');
  return value;
}
function pose(value: unknown, allowOffset = false): Frame {
  const source = record(value);
  const result: Frame = {};
  for (const key of Object.keys(source)) {
    if (!['transform', 'opacity', ...(allowOffset ? ['offset'] : [])].includes(key)) throw new Error(`Unsupported pose property: ${key}`);
  }
  if (source.transform !== undefined) {
    if (typeof source.transform !== 'string' || source.transform.length > 180 || !/^(?:(?:translate[XY]?|scale[XY]?|rotate)\([-\d.,\s]+(?:px|deg)?(?:,\s*[-\d.]+(?:px|deg)?)?\)\s*)+$/.test(source.transform)) throw new Error('Invalid transform');
    result.transform = source.transform;
  }
  if (source.opacity !== undefined) result.opacity = numeric(source.opacity, 0, 1);
  if (source.offset !== undefined) result.offset = numeric(source.offset, 0, 1);
  return result;
}
function track(value: unknown): Track {
  const source = record(value);
  if (!Array.isArray(source.frames) || source.frames.length < 2 || source.frames.length > 12 || typeof source.loop !== 'boolean') throw new Error('Invalid track');
  const frames = source.frames.map(frame => pose(frame, true));
  let previousOffset = -1;
  for (const frame of frames) {
    if (frame.offset !== undefined) {
      if (frame.offset < previousOffset) throw new Error('Offsets must be ordered');
      previousOffset = frame.offset;
    }
  }
  return { part: part(source.part), frames, duration: numeric(source.duration, 200, 30000), loop: source.loop, delay: numeric(source.delay ?? 0, 0, 30000) };
}
export function parseMotions(value: unknown): MotionLibrary {
  const source = record(value);
  if (source.version !== 1) throw new Error('Unsupported motion version');
  const shared = record(source.shared);
  const clips = record(source.clips);
  const result = {} as MotionLibrary;
  for (const state of stateNames) {
    const item = record(clips[state]);
    if (typeof item.label !== 'string' || item.label.length > 40 || typeof item.caption !== 'string' || item.caption.length > 160 || !Array.isArray(item.tracks) || item.tracks.length > 10) throw new Error(`Invalid clip: ${state}`);
    const poses: Partial<Record<Part, Pose>> = {};
    for (const [key, value] of Object.entries(record(item.pose))) poses[part(key)] = pose(value);
    const tracks = item.tracks.map(value => track(typeof value === 'string' ? shared[value] : value));
    if (new Set(tracks.map(item => item.part)).size !== tracks.length) throw new Error('Duplicate animated part');
    const clip: Clip = { label: item.label, caption: item.caption, pose: poses, tracks };
    if (item.returnTo !== undefined) {
      if (item.returnTo !== 'idle' || tracks.some(item => item.loop) || !tracks.length) throw new Error('One-shot clips must finish and return to idle');
      clip.returnTo = item.returnTo;
    }
    result[state] = clip;
  }
  return result;
}
export function shouldSuspend(paused: boolean, hidden: boolean, documentHidden: boolean): boolean {
  return paused || hidden || documentHidden;
}
