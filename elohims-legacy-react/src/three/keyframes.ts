export type KeyframeState = [number, number, number]; // [scatter (0-1), xOffset, yRotation]

// [section position u, scatter (0-1), x offset, rotation (0 = front, PI = back)]
export const KEYFRAMES: readonly [number, number, number, number][] = [
  [0, 0, 3.4, 0],
  [0.5, 0, 3.4, 0],
  [1, 1, 0, 0],
  [1.5, 0, -4.4, Math.PI],
  [2.4, 0, -4.4, Math.PI],
  [2.8, 1, 0, Math.PI],
  [3.2, 0, 3.4, 0],
  [3.8, 0, 3.4, 0],
  [4.3, 1, 0, 0],
  [6, 1, 0, 0],
] as const;

/**
 * Cubic smoothstep interpolation: 3t^2 - 2t^3
 */
export const smoothstep = (t: number): number => t * t * (3 - 2 * t);

/**
 * Interpolates the keyframe table based on normalized scroll progress u.
 * Returns [scatterFactor, xOffset, yRotation].
 */
export function interpolateKeyframes(u: number): KeyframeState {
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    const a = KEYFRAMES[i];
    const b = KEYFRAMES[i + 1];
    if (u <= b[0]) {
      const rawProgress = (u - a[0]) / (b[0] - a[0]);
      const clamped = Math.min(1, Math.max(0, rawProgress));
      const t = smoothstep(clamped);
      return [
        a[1] + (b[1] - a[1]) * t,
        a[2] + (b[2] - a[2]) * t,
        a[3] + (b[3] - a[3]) * t,
      ];
    }
  }

  const last = KEYFRAMES[KEYFRAMES.length - 1];
  return [last[1], last[2], last[3]];
}
