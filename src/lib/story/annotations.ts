/**
 * Pure layout of the captions that follow the objects of the photograph.
 * Coordinates are CSS pixels of the stage; nothing here touches the DOM.
 */

export type Side = 'left' | 'right';
/** Where a caption ended up: beside its object, or above it on a vertical leader. */
export type Placement = Side | 'above';
export type Rect = { x: number; y: number; w: number; h: number };

export type Candidate = {
  id: string;
  /** Tracked object the caption belongs to. */
  object: string;
  /** Centre of the object on screen, and how far from it the leader starts. */
  x: number;
  y: number;
  reach: number;
  /** Distance from the centre up to where a vertical leader starts. */
  rise: number;
  /** Width of the caption on one line; `wrap` splits it for a narrower column. */
  width: number;
  side: Side;
};

export type Placed = {
  id: string;
  side: Placement;
  /** Point on the object where the leader starts. */
  ax: number;
  ay: number;
  /** Edge of the text nearest to the object (its centre when above), and its vertical centre. */
  tx: number;
  ty: number;
  lines: number;
  maxWidth: number;
  box: Rect;
};

export type LayoutOptions = {
  width: number;
  height: number;
  lineHeight: number;
  /** Horizontal run of the leader before the text. */
  gap: number;
  /** Distance kept from the edges of the stage. */
  margin: number;
  /** Widest a caption may be before it wraps. */
  measure: number;
  /** Align the captions of each side on a single column (used while the objects form a tower). */
  column: boolean;
  /** Areas the captions must leave free, such as the text of the chapters. */
  obstacles: Rect[];
  /** Objects of the photograph a caption should not cover, if the other side is free. */
  avoid: Array<Rect & { object: string; soft?: boolean }>;
  /** Lines and widest line of a caption set within a given width. */
  fit: (id: string, maxWidth: number) => { lines: number; width: number };
};

const inflate = (r: Rect, by: number): Rect => ({
  x: r.x - by,
  y: r.y - by,
  w: r.w + by * 2,
  h: r.h + by * 2,
});
const overlaps = (a: Rect, b: Rect) =>
  a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

/** The run of the leader between the object and its caption, as a thin box. */
function leaderBox(p: Placed): Rect {
  if (p.side === 'above') {
    const bottom = p.box.y + p.box.h;
    return { x: p.ax - 1, y: bottom, w: 2, h: Math.max(0, p.ay - bottom) };
  }
  return {
    x: Math.min(p.ax, p.tx),
    y: p.ty - 1,
    w: Math.abs(p.tx - p.ax),
    h: 2,
  };
}

/** Captions point away from the middle of the composition; a small dead zone avoids flicker. */
export function chooseSide(
  x: number,
  pivot: number,
  previous: Side | undefined,
  deadZone: number,
): Side {
  if (previous && Math.abs(x - pivot) < deadZone) return previous;
  return x < pivot ? 'left' : 'right';
}

/** Push boxes apart along y, keeping their order and staying within [top, bottom]. */
export function relax(
  items: ReadonlyArray<{ y: number; h: number }>,
  gap: number,
  top: number,
  bottom: number,
): number[] {
  const ys = items.map((item) => item.y);
  for (let i = 1; i < ys.length; i++) {
    const min = ys[i - 1] + (items[i - 1].h + items[i].h) / 2 + gap;
    if (ys[i] < min) ys[i] = min;
  }
  for (let i = ys.length - 1; i >= 0; i--) {
    const max =
      i === ys.length - 1
        ? bottom - items[i].h / 2
        : ys[i + 1] - (items[i].h + items[i + 1].h) / 2 - gap;
    if (ys[i] > max) ys[i] = max;
  }
  for (let i = 0; i < ys.length; i++) {
    const min =
      i === 0
        ? top + items[i].h / 2
        : ys[i - 1] + (items[i - 1].h + items[i].h) / 2 + gap;
    if (ys[i] < min) ys[i] = min;
  }
  return ys;
}

function placeAbove(
  c: Candidate,
  o: LayoutOptions,
  lift: number,
): Placed | undefined {
  const maxWidth = Math.min(o.measure, o.width - o.margin * 2);
  const { lines, width: w } =
    c.width <= maxWidth ? { lines: 1, width: c.width } : o.fit(c.id, maxWidth);
  const h = lines * o.lineHeight;
  const ay = c.y - c.rise;
  const ty = ay - o.gap * 0.6 * lift - h / 2;
  if (ty - h / 2 < o.margin) return undefined;
  const tx = Math.min(
    o.width - o.margin - w / 2,
    Math.max(o.margin + w / 2, c.x),
  );
  return {
    id: c.id,
    side: 'above',
    ax: c.x,
    ay,
    tx,
    ty,
    lines,
    maxWidth,
    box: { x: tx - w / 2, y: ty - h / 2, w, h },
  };
}

function place(
  c: Candidate,
  side: Side,
  columnX: number | undefined,
  o: LayoutOptions,
  dy = 0,
  stretch = 1,
): Placed | undefined {
  const ax = side === 'left' ? c.x - c.reach : c.x + c.reach;
  const run = o.gap * stretch;
  const tx = columnX ?? (side === 'left' ? ax - run : ax + run);
  const room = side === 'left' ? tx - o.margin : o.width - o.margin - tx;
  const maxWidth = Math.min(o.measure, room);
  if (maxWidth < o.measure * 0.45) return undefined;
  const { lines, width: w } =
    c.width <= maxWidth ? { lines: 1, width: c.width } : o.fit(c.id, maxWidth);
  const h = lines * o.lineHeight;
  const ty = c.y + dy;
  if (ty - h / 2 < o.margin || ty + h / 2 > o.height - o.margin)
    return undefined;
  return {
    id: c.id,
    side,
    ax,
    ay: c.y,
    tx,
    ty,
    lines,
    maxWidth,
    box: { x: side === 'left' ? tx - w : tx, y: ty - h / 2, w, h },
  };
}

export function layoutCaptions(
  candidates: ReadonlyArray<Candidate>,
  o: LayoutOptions,
): Placed[] {
  const inside = candidates.filter(
    (c) =>
      c.x > o.margin &&
      c.x < o.width - o.margin &&
      c.y > o.margin &&
      c.y < o.height - o.margin,
  );
  const columns: Partial<Record<Side, number>> = {};
  if (o.column) {
    for (const side of ['left', 'right'] as const) {
      const xs = inside
        .filter((c) => c.side === side)
        .map((c) => (side === 'left' ? c.x - c.reach : c.x + c.reach));
      if (xs.length)
        columns[side] =
          side === 'left' ? Math.min(...xs) - o.gap : Math.max(...xs) + o.gap;
    }
  }
  const placed: Placed[] = [];
  for (const c of inside) {
    const other: Side = c.side === 'left' ? 'right' : 'left';
    // Beside the object first; then, by increasing visual cost, the other side, a longer
    // leader that clears a neighbour, or a line or two higher or lower.
    const tries = o.column
      ? [{ side: c.side, k: 0, s: 1, cost: 0 }]
      : (['same', 'other'] as const)
          .flatMap((which) =>
            [0, -1.3, 1.3, -2.4, 2.4, -3.6, 3.6, -5, 5].flatMap((k) =>
              [1, 2.4, 4, 6].map((s) => ({
                side: which === 'same' ? c.side : other,
                k,
                s,
                cost:
                  Math.abs(k) + (s - 1) * 0.55 + (which === 'other' ? 0.9 : 0),
              })),
            ),
          )
          .sort((a, b) => a.cost - b.cost);
    // Above the object, on a vertical leader, when its sides are crowded.
    const lifts =
      o.column || o.height < 420
        ? []
        : [1, 2.4, 4, 6, 8, 11, 14].map((s) => ({
            s,
            cost: 1.2 + (s - 1) * 0.3,
          }));
    const options = [
      ...tries.map((t) => ({
        cost: t.cost,
        make: () =>
          place(
            c,
            t.side,
            t.side === c.side ? columns[c.side] : undefined,
            o,
            t.k * o.lineHeight,
            t.s,
          ),
      })),
      ...lifts.map((l) => ({
        cost: l.cost,
        make: () => placeAbove(c, o, l.s),
      })),
    ]
      .sort((a, b) => a.cost - b.cost)
      .map((t) => t.make())
      .filter((p): p is Placed => Boolean(p));
    // In free placement the captions already set are obstacles too; a column is
    // spaced afterwards by the relaxation.
    const taken = (p: Placed) =>
      !o.column && placed.some((q) => overlaps(p.box, inflate(q.box, 3)));
    const blocked = (p: Placed) =>
      o.obstacles.some((ob) => overlaps(p.box, ob)) || taken(p);
    // A caption never covers another object: with no clean place it waits for a later frame.
    // Soft areas (a plain surface such as the pedestal) are left free only when possible.
    const covers = (p: Placed, soft: boolean) =>
      o.avoid.some(
        (a) =>
          a.object !== c.object &&
          (soft || !a.soft) &&
          (overlaps(p.box, a) || overlaps(leaderBox(p), a)),
      );
    const ok =
      options.find((p) => !blocked(p) && !covers(p, true)) ??
      options.find((p) => !blocked(p) && !covers(p, false));
    if (ok) placed.push(ok);
  }
  if (!o.column) return placed;
  for (const side of ['left', 'right'] as const) {
    const group = placed
      .filter((p) => p.side === side)
      .sort((a, b) => a.ty - b.ty);
    const ys = relax(
      group.map((p) => ({ y: p.ty, h: p.box.h })),
      o.lineHeight * 0.35,
      o.margin,
      o.height - o.margin,
    );
    group.forEach((p, i) => {
      p.ty = ys[i];
      p.box.y = ys[i] - p.box.h / 2;
    });
  }
  // A caption moved by the relaxation may now sit on a chapter: leave it out.
  return placed.filter((p) => !o.obstacles.some((ob) => overlaps(p.box, ob)));
}

/**
 * Word wrap against a measuring function. The line count is the greedy one; the breaks are
 * then balanced so that no line is much longer than the others ("le cene fuori / con gli amici").
 */
export function wrap(
  text: string,
  maxWidth: number,
  measure: (s: string) => number,
): string[] {
  const words = text.split(/\s+/);
  const setIn = (limit: number) => {
    const lines: string[] = [];
    let current = '';
    for (const word of words) {
      const next = current ? `${current} ${word}` : word;
      if (current && measure(next) > limit) {
        lines.push(current);
        current = word;
      } else current = next;
    }
    lines.push(current);
    return lines;
  };
  const count = setIn(maxWidth).length;
  if (count === 1) return [text];
  // Narrowest width that still sets the text in the same number of lines.
  let lo = Math.max(...words.map(measure));
  let hi = maxWidth;
  for (let step = 0; step < 14; step++) {
    const mid = (lo + hi) / 2;
    if (setIn(mid).length > count) lo = mid;
    else hi = mid;
  }
  return setIn(hi);
}
