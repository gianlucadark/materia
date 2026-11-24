import type { Rect, Side } from './annotations';
import {
  coverRect,
  damp,
  frameWindow,
  keyedPosition,
  nextFrame,
} from './frames';
import { createNotes, type NoteConfig } from './notes';

type FrameSets = { desktop: string[]; mobile: string[] };
type DeviceNavigator = Navigator & { connection?: { saveData?: boolean } };

export function initStory(root: HTMLElement) {
  const surface = root.querySelector<HTMLCanvasElement>('.story-canvas');
  const context = surface?.getContext('2d', { alpha: false });
  const sets = JSON.parse(root.dataset.frames ?? '{}') as FrameSets;
  if (!surface || !context || !sets.desktop?.length) return;
  const canvas = surface;
  const ctx = context;
  const lastFrame = Number(root.dataset.lastFrame) || 96;
  const chapters = [...root.querySelectorAll<HTMLElement>('[data-frame]')];
  const cards = [...root.querySelectorAll<HTMLElement>('.story-card')];
  const index = root.querySelector<HTMLElement>('.method-index');
  const links = [
    ...root.querySelectorAll<HTMLAnchorElement>('.method-index a'),
  ];
  const layer = root.querySelector<SVGSVGElement>('.story-notes');
  const notes = layer
    ? createNotes(layer, JSON.parse(root.dataset.notes ?? '[]') as NoteConfig[])
    : undefined;
  const portrait = matchMedia('(max-aspect-ratio: 5/6)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean((navigator as DeviceNavigator).connection?.saveData);
  const stepped = () => reduced.matches || saveData;
  const currentSet = (): keyof FrameSets =>
    portrait.matches && sets.mobile?.length ? 'mobile' : 'desktop';
  // Fraction of the sequence (0..1) for a Blender frame number (1..lastFrame).
  const keyOf = (el: HTMLElement) =>
    (Number(el.dataset.frame) - 1) / (lastFrame - 1);

  let set = currentSet();
  let frames = sets[set];
  let generation = 0;
  const decoded = new Map<number, HTMLImageElement>();
  const pending = new Set<number>();
  const failed = new Set<number>();
  let shown = -1;
  let desired = -1;
  let direction = 1;
  let position = 0;
  let requests: number[] = [];
  let active = -1;
  let anchors: { at: number; key: number }[] = [];
  let size = { w: 1600, h: 900 };
  let raf = 0;
  let last = 0;

  function wake() {
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function fillWindow() {
    for (const index of requests) {
      if (pending.size >= 3) break;
      if (decoded.has(index) || pending.has(index) || failed.has(index))
        continue;
      const epoch = generation;
      pending.add(index);
      const image = new Image();
      image.decoding = 'async';
      image.src = `/story/${set}/${frames[index]}`;
      image
        .decode()
        .then(() => {
          if (epoch === generation && requests.includes(index))
            decoded.set(index, image);
        })
        .catch(() => {
          if (epoch === generation) failed.add(index);
        })
        .finally(() => {
          if (epoch === generation) {
            pending.delete(index);
            wake();
          }
        });
    }
  }

  function paint(index: number) {
    const image = decoded.get(index);
    if (!image) return;
    size = { w: image.naturalWidth, h: image.naturalHeight };
    const r = coverRect(size.w, size.h, canvas.width, canvas.height);
    ctx.drawImage(
      image,
      r.sx,
      r.sy,
      r.sw,
      r.sh,
      0,
      0,
      canvas.width,
      canvas.height,
    );
    shown = index;
    root.classList.add('story-live');
  }

  /** Scroll progress at which each chapter sits in the middle of the stage. */
  function measureAnchors() {
    const box = root.getBoundingClientRect();
    const stage = canvas.parentElement!.clientHeight;
    const travel = Math.max(1, box.height - stage);
    anchors = chapters.map((chapter) => {
      const rect = chapter.getBoundingClientRect();
      return {
        at: (rect.top - box.top + rect.height / 2 - stage / 2) / travel,
        key: keyOf(chapter),
      };
    });
  }

  function obstacles(): Rect[] {
    const origin = layer!.getBoundingClientRect();
    const pad = 14;
    return [...cards, ...(index ? [index] : [])]
      .map((el) => el.getBoundingClientRect())
      .filter((r) => r.bottom > origin.top && r.top < origin.bottom)
      .map((r) => ({
        x: r.left - origin.left - pad,
        y: r.top - origin.top - pad,
        w: r.width + pad * 2,
        h: r.height + pad * 2,
      }));
  }

  /** While the objects stand in a tower, the captions line up opposite the chapter text. */
  function columnSide(frame: number): Side | undefined {
    if (set !== 'desktop') return undefined;
    let nearest = 0;
    chapters.forEach((chapter, i) => {
      const d = Math.abs(Number(chapter.dataset.frame) - frame);
      if (d < Math.abs(Number(chapters[nearest].dataset.frame) - frame))
        nearest = i;
    });
    const chapter = chapters[nearest];
    if (chapter.dataset.captions !== 'column') return undefined;
    return chapter.dataset.align === 'left' ? 'right' : 'left';
  }

  function tick(now: number) {
    raf = 0;
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60;
    const bounds = root.getBoundingClientRect();
    const height = canvas.parentElement!.clientHeight;
    const progress = Math.max(
      0,
      Math.min(1, -bounds.top / Math.max(1, bounds.height - height)),
    );
    root.style.setProperty('--story-progress', progress.toFixed(4));
    const chapter = chapters.reduce(
      (closest, item, i) => {
        const rect = item.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - height / 2);
        return distance < closest.distance ? { index: i, distance } : closest;
      },
      { index: 0, distance: Infinity },
    ).index;
    if (chapter !== active) {
      active = chapter;
      links.forEach((link, i) => {
        if (i + 1 === active) link.setAttribute('aria-current', 'step');
        else link.removeAttribute('aria-current');
      });
    }
    const keys = chapters.map((ch) =>
      Math.round(keyOf(ch) * (frames.length - 1)),
    );
    const goal = stepped()
      ? keys[chapter]
      : keyedPosition(progress, anchors, frames.length);
    position = stepped() || desired < 0 ? goal : damp(position, goal, dt, 16);
    const target = Math.round(position);
    if (target !== desired) {
      direction = target > desired ? 1 : -1;
      desired = target;
      requests = stepped()
        ? [...new Set([target, ...keys])]
        : frameWindow(target, frames.length, direction);
      for (const index of decoded.keys()) {
        if (index !== shown && !requests.includes(index)) decoded.delete(index);
      }
    }
    fillWindow();
    const next = stepped()
      ? decoded.has(target)
        ? target
        : shown
      : nextFrame(target, shown, new Set(decoded.keys()));
    if (next !== shown) paint(next);
    let gliding = false;
    if (notes && shown >= 0 && bounds.bottom > 0) {
      const frame = 1 + (shown * (lastFrame - 1)) / (frames.length - 1);
      gliding = notes.update({
        set,
        index: shown,
        count: frames.length,
        imageWidth: size.w,
        imageHeight: size.h,
        lastFrame,
        column: columnSide(frame),
        obstacles: obstacles(),
        dt: stepped() ? 0 : dt,
      });
    }
    const settling = position !== goal || gliding;
    last = settling ? now : 0;
    if (settling) wake();
  }

  function resize() {
    const scale = Math.min(
      devicePixelRatio || 1,
      2,
      (set === 'desktop' ? 1600 : 750) / canvas.clientWidth,
      (set === 'desktop' ? 900 : 1000) / canvas.clientHeight,
    );
    const w = Math.max(1, Math.round(canvas.clientWidth * scale));
    const h = Math.max(1, Math.round(canvas.clientHeight * scale));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      paint(shown);
    }
    measureAnchors();
    notes?.restyle();
    wake();
  }

  function start() {
    generation++;
    set = currentSet();
    frames = sets[set];
    decoded.clear();
    pending.clear();
    failed.clear();
    desired = shown = -1;
    root.classList.remove('story-live');
    resize();
  }
  addEventListener('scroll', wake, { passive: true });
  new ResizeObserver(resize).observe(canvas);
  new ResizeObserver(measureAnchors).observe(root);
  portrait.addEventListener('change', start);
  reduced.addEventListener('change', start);
  notes?.ready.then(wake);
  start();
}
