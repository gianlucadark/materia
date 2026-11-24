import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { chooseSide, layoutCaptions, relax, wrap } from './annotations';
import type { Candidate, LayoutOptions } from './annotations';
import { editorial } from '../../config/editorial';

const base: LayoutOptions = {
  width: 1000,
  height: 600,
  lineHeight: 20,
  gap: 30,
  margin: 16,
  measure: 200,
  column: false,
  obstacles: [],
  avoid: [],
  fit: (_id, max) => ({
    lines: Math.ceil(240 / max),
    width: 240 / Math.ceil(240 / max),
  }),
};
const at = (id: string, x: number, y: number, side: Candidate['side']) => ({
  id,
  object: id,
  x,
  y,
  reach: 16,
  rise: 16,
  width: 120,
  side,
});

describe('captions', () => {
  it('point away from the middle of the composition, with hysteresis', () => {
    expect(chooseSide(400, 500, undefined, 10)).toBe('left');
    expect(chooseSide(505, 500, 'left', 10)).toBe('left');
    expect(chooseSide(520, 500, 'left', 10)).toBe('right');
  });
  it('never overlap on the same side and stay inside the stage', () => {
    const ys = relax(
      [
        { y: 5, h: 20 },
        { y: 10, h: 20 },
        { y: 12, h: 40 },
      ],
      4,
      0,
      600,
    );
    expect(ys[0]).toBeGreaterThanOrEqual(10);
    expect(ys[1] - ys[0]).toBeGreaterThanOrEqual(24);
    expect(ys[2] - ys[1]).toBeGreaterThanOrEqual(34);
  });
  it('flip to the free side when a chapter covers the preferred one', () => {
    const placed = layoutCaptions([at('a', 300, 300, 'left')], {
      ...base,
      obstacles: [{ x: 0, y: 200, w: 260, h: 200 }],
    });
    expect(placed).toHaveLength(1);
    expect(placed[0].side).toBe('right');
    expect(placed[0].box.x).toBeGreaterThan(300);
  });
  it('prefer the side that leaves the other objects uncovered', () => {
    const placed = layoutCaptions([at('a', 500, 300, 'right')], {
      ...base,
      avoid: [
        { object: 'a', x: 480, y: 280, w: 40, h: 40 },
        { object: 'b', x: 560, y: 290, w: 80, h: 20 },
      ],
    });
    expect(placed[0].side).toBe('left');
  });
  it('never let two free captions overlap, even on opposite sides', () => {
    const placed = layoutCaptions(
      [at('a', 400, 300, 'right'), at('b', 640, 300, 'left')],
      base,
    );
    expect(placed).toHaveLength(2);
    const [a, b] = placed.map((p) => p.box);
    const apart =
      a.x + a.w <= b.x ||
      b.x + b.w <= a.x ||
      a.y + a.h <= b.y ||
      b.y + b.h <= a.y;
    expect(apart).toBe(true);
  });
  it('rise above an object whose sides are taken', () => {
    const placed = layoutCaptions([at('a', 500, 300, 'right')], {
      ...base,
      avoid: [
        { object: 'b', x: 300, y: 250, w: 180, h: 140 },
        { object: 'c', x: 520, y: 220, w: 300, h: 160 },
      ],
    });
    expect(placed[0].side).toBe('above');
    expect(placed[0].box.y + placed[0].box.h).toBeLessThan(284);
  });
  it('drop a caption that has nowhere to go', () => {
    const placed = layoutCaptions([at('a', 500, 300, 'left')], {
      ...base,
      obstacles: [{ x: 0, y: 0, w: 1000, h: 600 }],
    });
    expect(placed).toEqual([]);
  });
  it('align a tower on one column and wrap near the edge', () => {
    const placed = layoutCaptions(
      [
        { ...at('a', 300, 200, 'left'), width: 240 },
        at('b', 320, 260, 'left'),
        at('c', 600, 260, 'right'),
      ],
      { ...base, column: true },
    );
    expect(placed.map((p) => p.tx)).toEqual([254, 254, 646]);
    expect(placed.map((p) => p.lines)).toEqual([2, 1, 1]);
  });
  it('wraps words to the measure', () => {
    const chars = (s: string) => s.length * 6;
    expect(wrap('la fame delle cinque', 60, chars)).toEqual([
      'la fame',
      'delle',
      'cinque',
    ]);
    expect(wrap('le cene fuori con gli amici', 100, chars)).toEqual([
      'le cene fuori',
      'con gli amici',
    ]);
    expect(wrap('il lavoro', 100, chars)).toEqual(['il lavoro']);
  });
});

describe('tracked sequence', () => {
  const tracks = JSON.parse(
    readFileSync('public/story/tracks.json', 'utf8'),
  ) as Record<string, Record<string, number[][]>>;
  it('has one sample per rendered frame for every annotated object', () => {
    for (const note of editorial.story.annotations) {
      expect(tracks.desktop[note.object]).toHaveLength(191);
      expect(tracks.desktop[note.object][0]).toHaveLength(4);
      expect(tracks.mobile[note.object]).toHaveLength(96);
    }
  });
  it('keeps the objects that stay on the table outside the finished tower', () => {
    const last = (key: string) => tracks.desktop[key].at(-1)!;
    const tower = last('stoneBase');
    for (const key of ['fig', 'almonds']) {
      expect(Math.abs(last(key)[0] - tower[0])).toBeGreaterThan(tower[2]);
    }
  });
});
