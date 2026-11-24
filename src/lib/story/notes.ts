import {
  chooseSide,
  layoutCaptions,
  wrap,
  type Placed,
  type Candidate,
  type Placement,
  type Rect,
  type Side,
} from './annotations';
import { coverRect, damp } from './frames';

type Track = [number, number, number, number];
// Where the leader touches the object, as a share of its half width: the olive branch and
// the scattered almonds have wide, airy bounding boxes.
const REACH: Record<string, number> = { olive: 0.4, almonds: 0.5 };
// Share of the bounding box a caption keeps clear: the thin diagonal branch fills little of it.
const BODY: Record<string, number> = { olive: 0.5 };
// Plain surfaces a caption may cross when nothing else is free.
const SOFT = new Set(['pedestal']);
type Tracks = Partial<Record<string, Record<string, Track[]>>>;
export type NoteConfig = {
  object: string;
  text: string;
  from: number;
  to: number;
};
export type NoteFrame = {
  set: string;
  index: number;
  count: number;
  imageWidth: number;
  imageHeight: number;
  lastFrame: number;
  /** Side holding a single column of captions, while the objects form a tower. */
  column?: Side;
  obstacles: Rect[];
  /** Seconds since the previous update, or 0 to place the captions without easing. */
  dt: number;
};

const NS = 'http://www.w3.org/2000/svg';

/** Captions drawn in an SVG layer above the canvas, glued to the tracked objects. */
export function createNotes(svg: SVGSVGElement, notes: NoteConfig[]) {
  let tracks: Tracks | undefined;
  const ready = fetch('/story/tracks.json')
    .then((r) => (r.ok ? (r.json() as Promise<Tracks>) : undefined))
    .then((t) => {
      tracks = t;
    })
    .catch(() => undefined);

  const items = notes.map((note, i) => {
    const g = document.createElementNS(NS, 'g');
    const path = document.createElementNS(NS, 'path');
    const dot = document.createElementNS(NS, 'circle');
    const label = document.createElementNS(NS, 'text');
    g.classList.add('note');
    dot.setAttribute('r', '2.25');
    g.append(path, dot, label);
    svg.append(g);
    return {
      ...note,
      id: String(i),
      g,
      path,
      dot,
      label,
      side: undefined as Placement | undefined,
      x: NaN,
      y: NaN,
      shape: '',
      on: false,
    };
  });

  const ctx = document.createElement('canvas').getContext('2d');
  let fontSize = 16;
  let lineHeight = 19;
  const measure = (s: string) =>
    ctx ? ctx.measureText(s).width : s.length * fontSize * 0.46;

  function restyle() {
    const style = getComputedStyle(svg);
    fontSize = parseFloat(style.fontSize) || 16;
    lineHeight = Math.round(fontSize * 1.18);
    if (ctx) ctx.font = `italic 400 ${fontSize}px ${style.fontFamily}`;
    for (const item of items) item.shape = '';
  }
  restyle();
  document.fonts?.ready.then(restyle);

  function hide(item: (typeof items)[number]) {
    if (!item.on) return;
    item.on = false;
    item.g.classList.remove('on');
  }

  /** Returns true while a caption is still gliding toward its place. */
  function update(f: NoteFrame): boolean {
    const set = tracks?.[f.set];
    const W = svg.clientWidth;
    const H = svg.clientHeight;
    if (!set || !W || !H) {
      items.forEach(hide);
      return false;
    }
    const frame = 1 + (f.index * (f.lastFrame - 1)) / Math.max(1, f.count - 1);
    const crop = coverRect(f.imageWidth, f.imageHeight, W, H);
    const scale = W / crop.sw;
    const live = items.filter((item) => {
      const samples = set[item.object];
      return (
        samples?.length === f.count && frame >= item.from && frame <= item.to
      );
    });
    const project = (object: string) => {
      const [x, y, rx, ry] = set[object][f.index];
      return {
        x: (x * f.imageWidth - crop.sx) * scale,
        y: (y * f.imageHeight - crop.sy) * scale,
        rx: rx * f.imageWidth * scale,
        ry: ry * f.imageHeight * scale,
      };
    };
    const points = live.map((item) => ({ item, ...project(item.object) }));
    const pivot =
      points.reduce((sum, p) => sum + p.x, 0) / Math.max(1, points.length);
    const candidates: Candidate[] = points.map((p) => {
      const side =
        f.column ??
        chooseSide(
          p.x,
          pivot,
          p.item.side === 'above' ? undefined : p.item.side,
          Math.max(12, W * 0.02),
        );
      return {
        id: p.item.id,
        object: p.item.object,
        x: p.x,
        y: p.y,
        reach: p.rx * (REACH[p.item.object] ?? 0.8),
        rise: p.ry * (REACH[p.item.object] ?? 0.8),
        width: measure(p.item.text),
        side,
      };
    });
    // Bounding boxes are generous for round shapes: shrink them a little.
    const avoid = f.column
      ? []
      : Object.keys(set)
          .filter((object) => set[object].length === f.count)
          .map((object) => {
            const b = project(object);
            const k = BODY[object] ?? 0.85;
            return {
              object,
              x: b.x - b.rx * k,
              y: b.y - b.ry * k,
              w: b.rx * k * 2,
              h: b.ry * k * 2,
              soft: SOFT.has(object),
            };
          });
    const placed = layoutCaptions(candidates, {
      width: W,
      height: H,
      lineHeight,
      gap: Math.max(22, fontSize * 1.6),
      margin: Math.max(12, fontSize),
      measure: Math.min(fontSize * (f.column ? 13 : 9.5), W * 0.4),
      column: Boolean(f.column),
      obstacles: f.obstacles,
      avoid,
      fit: (id, max) => {
        const lines = wrap(items[Number(id)].text, max, measure);
        return {
          lines: lines.length,
          width: Math.max(...lines.map(measure)),
        };
      },
    });

    let moving = false;
    const shownIds = new Set(placed.map((p) => p.id));
    for (const item of items) if (!shownIds.has(item.id)) hide(item);
    for (const p of placed) {
      const item = items[Number(p.id)];
      const flipped = item.side !== p.side;
      if (flipped || Number.isNaN(item.x) || !f.dt || !item.on) {
        item.x = p.tx;
        item.y = p.ty;
      } else {
        item.x = damp(item.x, p.tx, f.dt, 12);
        item.y = damp(item.y, p.ty, f.dt, 12);
        moving ||= item.x !== p.tx || item.y !== p.ty;
      }
      item.side = p.side;
      const lines =
        p.lines > 1 ? wrap(item.text, p.maxWidth, measure) : [item.text];
      const shape = `${p.side}|${lines.join('|')}`;
      if (shape !== item.shape) {
        item.shape = shape;
        item.label.setAttribute(
          'text-anchor',
          p.side === 'left' ? 'end' : p.side === 'right' ? 'start' : 'middle',
        );
        item.label.replaceChildren(
          ...lines.map((line) => {
            const span = document.createElementNS(NS, 'tspan');
            span.textContent = line;
            return span;
          }),
        );
      }
      const top = item.y - ((lines.length - 1) * lineHeight) / 2;
      [...item.label.children].forEach((span, i) => {
        span.setAttribute('x', item.x.toFixed(1));
        span.setAttribute('y', (top + i * lineHeight).toFixed(1));
      });
      item.path.setAttribute('d', leader(p, item.x, item.y, lines.length));
      item.dot.setAttribute('cx', p.ax.toFixed(1));
      item.dot.setAttribute('cy', p.ay.toFixed(1));
      if (!item.on) {
        item.on = true;
        item.g.classList.add('on');
      }
    }
    return moving;
  }

  /** Beside: a short elbow, then a horizontal run to the text. Above: straight up. */
  function leader(p: Placed, x: number, y: number, lines: number) {
    const n = (v: number) => v.toFixed(1);
    if (p.side === 'above') {
      const bottom = y + (lines * lineHeight) / 2 - lineHeight * 0.15;
      return `M${n(p.ax)} ${n(p.ay)}L${n(p.ax)} ${n(bottom)}`;
    }
    const dir = p.side === 'left' ? -1 : 1;
    const elbow = p.ax + dir * Math.min(10, Math.abs(x - p.ax) / 3);
    const end = x - dir * fontSize * 0.45;
    return `M${n(p.ax)} ${n(p.ay)}L${n(elbow)} ${n(y)}L${n(end)} ${n(y)}`;
  }

  return { ready, update, restyle };
}
