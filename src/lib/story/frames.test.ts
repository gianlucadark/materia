import { describe, expect, it } from 'vitest';
import {
  frameWindow,
  coverRect,
  keyedPosition,
  damp,
  nextFrame,
  progressToIndex,
  progressToPosition,
} from './frames';

describe('progressToPosition / progressToIndex', () => {
  it('maps the scroll range onto the frames and holds the last one', () => {
    expect(progressToIndex(0, 96)).toBe(0);
    expect(progressToIndex(-1, 96)).toBe(0);
    expect(progressToIndex(0.9, 96)).toBe(95);
    expect(progressToIndex(1, 96)).toBe(95);
    expect(progressToIndex(0.45, 96)).toBe(48);
  });
  it('is continuous between frames', () => {
    expect(progressToPosition(0.45, 191)).toBeCloseTo(95, 5);
    expect(progressToPosition(0.4525, 191)).toBeGreaterThan(95);
  });
  it('handles a single frame', () => {
    expect(progressToIndex(0.5, 1)).toBe(0);
  });
});

describe('keyedPosition', () => {
  const anchors = [
    { at: 0, key: 0 },
    { at: 0.25, key: 0.06 },
    { at: 0.5, key: 0.5 },
    { at: 1, key: 1 },
  ];
  it('lands on the frame of each chapter when it is centred', () => {
    expect(keyedPosition(0, anchors, 101)).toBe(0);
    expect(keyedPosition(0.25, anchors, 101)).toBeCloseTo(6, 6);
    expect(keyedPosition(0.5, anchors, 101)).toBeCloseTo(50, 6);
    expect(keyedPosition(1, anchors, 101)).toBe(100);
  });
  it('rests near a chapter and moves fastest between two', () => {
    const near =
      keyedPosition(0.26, anchors, 101) - keyedPosition(0.25, anchors, 101);
    const mid =
      keyedPosition(0.38, anchors, 101) - keyedPosition(0.37, anchors, 101);
    expect(mid).toBeGreaterThan(near * 5);
  });
  it('clamps outside the chapters', () => {
    expect(keyedPosition(-0.2, anchors, 101)).toBe(0);
    expect(keyedPosition(1.4, anchors, 101)).toBe(100);
  });
});

describe('damp', () => {
  it('eases toward the target independently of the frame rate', () => {
    const oneStep = damp(0, 10, 1 / 30);
    const twoSteps = damp(damp(0, 10, 1 / 60), 10, 1 / 60);
    expect(oneStep).toBeCloseTo(twoSteps, 6);
    expect(oneStep).toBeGreaterThan(0);
    expect(oneStep).toBeLessThan(10);
  });
  it('snaps when close enough and never overshoots', () => {
    expect(damp(9.999, 10, 1 / 60)).toBe(10);
    expect(damp(0, 10, 10)).toBe(10);
  });
});

describe('decoded frame selection', () => {
  it('holds the visible frame while out-of-order decodes arrive', () => {
    expect(nextFrame(12, 8, new Set([2, 7, 13]))).toBe(8);
    expect(nextFrame(12, 8, new Set([7, 9, 11, 13]))).toBe(11);
    expect(nextFrame(4, 11, new Set([3, 6, 9, 13]))).toBe(6);
    expect(nextFrame(4, -1, new Set([5]))).toBe(-1);
  });
  it('prefetches a bounded window on either side of a change of direction', () => {
    expect(frameWindow(0, 3, 1)).toEqual([0, 1, 2]);
    expect(frameWindow(1, 3, -1)).toEqual([1, 0, 2]);
    expect(frameWindow(100, 191, 1)).toHaveLength(13);
  });
});

describe('coverRect', () => {
  it('crops the sides of a wide frame in a portrait box', () => {
    const r = coverRect(1600, 900, 450, 900);
    expect(r.sh).toBeCloseTo(900);
    expect(r.sw).toBeCloseTo(450);
    expect(r.sx).toBeCloseTo(575);
    expect(r.sy).toBeCloseTo(0);
  });
});
