/** Pure helpers for the scroll-driven photographic sequence. */

/**
 * Scroll progress (0..1) → continuous position in the sequence (0..count-1).
 * The last `hold` share of the scroll keeps the final frame.
 */
export function progressToPosition(
  progress: number,
  count: number,
  hold = 0.1,
): number {
  if (count <= 1) return 0;
  const p = Math.min(1, Math.max(0, progress) / (1 - hold));
  return p * (count - 1);
}

/**
 * Scroll progress → continuous position, pinned to the chapters: each anchor says which
 * fraction of the sequence (0..1) is on screen when that chapter is centred. Between two
 * anchors the motion eases in and out, so the picture rests while the text is read.
 */
export function keyedPosition(
  progress: number,
  anchors: ReadonlyArray<{ at: number; key: number }>,
  count: number,
): number {
  if (count <= 1 || anchors.length === 0) return 0;
  const last = anchors[anchors.length - 1];
  let key = progress <= anchors[0].at ? anchors[0].key : last.key;
  for (let i = 1; i < anchors.length; i++) {
    const a = anchors[i - 1];
    const b = anchors[i];
    if (progress > a.at && progress <= b.at) {
      const t = (progress - a.at) / Math.max(1e-6, b.at - a.at);
      key = a.key + (b.key - a.key) * t * t * (3 - 2 * t);
      break;
    }
  }
  return Math.min(1, Math.max(0, key)) * (count - 1);
}

/** Scroll progress (0..1) → nearest whole frame index. */
export function progressToIndex(
  progress: number,
  count: number,
  hold = 0.1,
): number {
  return Math.round(progressToPosition(progress, count, hold));
}

/**
 * Frame-rate independent easing toward a target (exponential smoothing).
 * `rate` is the inverse time constant in 1/s: 9 settles 63 % of the gap in ~110 ms.
 */
export function damp(
  current: number,
  target: number,
  dtSeconds: number,
  rate = 9,
): number {
  const k = 1 - Math.exp(-rate * Math.max(0, dtSeconds));
  const next = current + (target - current) * k;
  return Math.abs(target - next) < 0.004 ? target : next;
}

/** Request the visible frame first, then neighbours, favouring the scroll direction. */
export function frameWindow(target: number, count: number, direction: number) {
  const order = [target];
  const ahead = direction < 0 ? -1 : 1;
  for (let distance = 1; distance <= 8; distance++) {
    order.push(target + ahead * distance);
    if (distance <= 4) order.push(target - ahead * distance);
  }
  return order.filter((index) => index >= 0 && index < count);
}

/** A late decode must never move the picture backwards relative to its target. */
export function nextFrame(
  target: number,
  shown: number,
  ready: ReadonlySet<number>,
) {
  if (ready.has(target)) return target;
  if (shown < 0) return shown;
  let best = shown;
  for (const index of ready) {
    if (target > shown && index > best && index < target) best = index;
    if (target < shown && index < best && index > target) best = index;
  }
  return best;
}

/** Source rectangle that fills the destination like `object-fit: cover`. */
export function coverRect(
  srcW: number,
  srcH: number,
  dstW: number,
  dstH: number,
  focusX = 0.5,
  focusY = 0.5,
) {
  const scale = Math.max(dstW / srcW, dstH / srcH);
  const sw = dstW / scale;
  const sh = dstH / scale;
  return {
    sx: (srcW - sw) * focusX,
    sy: (srcH - sh) * focusY,
    sw,
    sh,
  };
}
