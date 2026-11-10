import * as THREE from 'three';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';

export interface ParticleBuffers {
  totalParticles: number;
  shapePositions: Float32Array;
  shapeColors: Float32Array;
  starPositions: Float32Array;
  starSpeeds: Float32Array;
  initialSizes: Float32Array;
  backgroundPositions: Float32Array;
  /** Mid-flight swirl control point (designed in Blender); absent = straight-line morph */
  midPositions?: Float32Array;
}

/**
 * Loads the particle system authored in Blender Geometry Nodes (`tee-particles.bin`, "ELP2"):
 * garment points sampled on the cloth-simulated tee (ink-weighted), a noise-shaped
 * Milky-Way constellation, and a vortex control point per particle. Positions are
 * quantised: garment int16, stars int8 per axis, swirl int8 offset, brightness uint8.
 * The file order is pre-shuffled, so any prefix is an even subset (used on phones).
 */
export async function loadBlenderParticles(url: string, maxCount: number): Promise<ParticleBuffers> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`particles ${res.status}`);
  const buf = await res.arrayBuffer();
  const dv = new DataView(buf);
  const magic = String.fromCharCode(...new Uint8Array(buf, 0, 4));
  if (magic !== 'ELP2') throw new Error(`bad particle file ${magic}`);
  const total = dv.getUint32(4, true);
  const sR = dv.getFloat32(8, true);
  const tR = [dv.getFloat32(12, true), dv.getFloat32(16, true), dv.getFloat32(20, true)];
  const mR = dv.getFloat32(24, true);
  let o = 28;
  const S = new Int16Array(buf.slice(o, o + total * 6)); o += total * 6;
  const T = new Int8Array(buf, o, total * 3); o += total * 3;
  const M = new Int8Array(buf, o, total * 3); o += total * 3;
  const G = new Uint8Array(buf, o, total);

  const n = Math.min(total, maxCount);
  const shapePositions = new Float32Array(n * 3);
  const starPositions = new Float32Array(n * 3);
  const midPositions = new Float32Array(n * 3);
  const shapeColors = new Float32Array(n * 3);
  const starSpeeds = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    for (let a = 0; a < 3; a++) {
      const k = i * 3 + a;
      const s = (S[k] / 32767) * sR;
      const t = (T[k] / 127) * tR[a];
      shapePositions[k] = s;
      starPositions[k] = t;
      midPositions[k] = s * 0.55 + t * 0.45 + (M[k] / 127) * mR;
    }
    const g = G[i] / 255;
    shapeColors[i * 3] = shapeColors[i * 3 + 1] = shapeColors[i * 3 + 2] = g;
    // depth parallax keeps the nebula's structure coherent while it drifts
    starSpeeds[i] = 1.2 + 0.09 * (starPositions[i * 3 + 2] + 9) + Math.random() * 0.15;
  }
  const field = buildStarfield(n);
  return {
    totalParticles: n,
    shapePositions,
    shapeColors,
    starPositions,
    starSpeeds,
    midPositions,
    initialSizes: field.initialSizes,
    backgroundPositions: field.backgroundPositions,
  };
}

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = url;
  });
}

/**
 * Samples pixels from front and back images to produce 3D particle positions and colors.
 * Bright pixels (white ink print) receive 6x weight for crisp text legibility.
 */
export function buildParticleBuffers(
  frontImg: HTMLImageElement,
  backImg: HTMLImageElement,
  totalParticles: number
): ParticleBuffers {
  const half = Math.floor(totalParticles / 2);
  const shapePositions = new Float32Array(totalParticles * 3);
  const shapeColors = new Float32Array(totalParticles * 3);

  function sampleImage(
    img: HTMLImageElement,
    dir: number,
    offset: number
  ): void {
    const w = img.width;
    const h = img.height;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    const idx: number[] = [];
    const cum: number[] = [];
    let tot = 0;

    for (let p = 0; p < w * h; p++) {
      if (data[p * 4 + 3] > 200) {
        const l = (data[p * 4] + data[p * 4 + 1] + data[p * 4 + 2]) / 765;
        // Text / bright ink gets 6x weight
        tot += l > 0.5 ? 6 : 1;
        idx.push(p);
        cum.push(tot);
      }
    }

    const HT = 5.2;
    const W = (HT * w) / h;
    const hw = W / 2;

    for (let n = 0; n < half; n++) {
      const r = Math.random() * tot;
      let lo = 0;
      let hi = cum.length - 1;
      while (lo < hi) {
        const m = (lo + hi) >> 1;
        if (cum[m] < r) {
          lo = m + 1;
        } else {
          hi = m;
        }
      }

      const p = idx[lo];
      const px = p % w;
      const py = (p / w) | 0;
      let X = (px / w - 0.5) * W;
      const Y = -(py / h - 0.5) * HT;

      // Parabolic curvature representing cloth hanging depth
      const z =
        dir * 0.45 * (1 - 0.5 * (X / hw) * (X / hw)) + (Math.random() - 0.5) * 0.06;
      if (dir < 0) X = -X;

      const k = (offset + n) * 3;
      shapePositions[k] = X + (Math.random() - 0.5) * 0.012;
      shapePositions[k + 1] = Y + (Math.random() - 0.5) * 0.012;
      shapePositions[k + 2] = z;

      const l = (data[p * 4] + data[p * 4 + 1] + data[p * 4 + 2]) / 765;
      if (l > 0.5) {
        shapeColors[k] = 1;
        shapeColors[k + 1] = 1;
        shapeColors[k + 2] = 1;
      } else {
        const q = Math.min(1, 0.22 + l * 2.4);
        shapeColors[k] = q * 0.82;
        shapeColors[k + 1] = q * 0.8;
        shapeColors[k + 2] = q * 0.78;
      }
    }
  }

  sampleImage(frontImg, 1, 0);
  sampleImage(backImg, -1, half);

  return {
    totalParticles,
    shapePositions,
    shapeColors,
    ...buildStarfield(totalParticles),
  };
}

/** Constellation targets, drift speeds and the 1500 ambient background stars. */
function buildStarfield(totalParticles: number) {
  const starPositions = new Float32Array(totalParticles * 3);
  const starSpeeds = new Float32Array(totalParticles);
  const initialSizes = new Float32Array(totalParticles);

  // Starfield positions and autonomous leftward drift speeds
  for (let i = 0; i < totalParticles; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 34;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 18;

    // Organic leftward drift speed (units per second)
    starSpeeds[i] = 1.6 + Math.random() * 1.6;
    initialSizes[i] = 0.5 + Math.random() * 0.4;
  }

  // 1500 ambient background stars
  const backgroundPositions = new Float32Array(1500 * 3);
  for (let i = 0; i < 1500; i++) {
    backgroundPositions[i * 3] = (Math.random() - 0.5) * 60;
    backgroundPositions[i * 3 + 1] = (Math.random() - 0.5) * 36;
    backgroundPositions[i * 3 + 2] = -8 - Math.random() * 10;
  }

  return { starPositions, starSpeeds, initialSizes, backgroundPositions };
}

/** Reads an image (HTMLImageElement or ImageBitmap) into RGBA pixels. */
function readPixels(image: CanvasImageSource & { width: number; height: number }) {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(image, 0, 0);
  return { data: ctx.getImageData(0, 0, image.width, image.height).data, w: image.width, h: image.height };
}

/**
 * Samples particles from the surface of the Blender-modelled tee so the constellation
 * dissolves out of (and re-forms into) the real 3D garment. Each point takes its colour
 * from the print texture at its UV; bright ink keeps the original 6x weighting so the
 * typography stays legible while the shirt is in particle form.
 */
export function buildParticleBuffersFromMesh(
  meshes: THREE.Mesh[],
  totalParticles: number,
  root?: THREE.Object3D
): ParticleBuffers {
  // Sample in the root's local space so scroll transforms on parents don't leak in
  root?.updateWorldMatrix(true, false);
  const toRoot = root ? root.matrixWorld.clone().invert() : new THREE.Matrix4();
  const rel = new THREE.Matrix4();
  const shapePositions = new Float32Array(totalParticles * 3);
  const shapeColors = new Float32Array(totalParticles * 3);
  const per = Math.ceil(totalParticles / meshes.length);
  const pos = new THREE.Vector3();
  const uv = new THREE.Vector2();

  let n = 0;
  meshes.forEach((mesh, mi) => {
    mesh.updateWorldMatrix(true, false);
    rel.multiplyMatrices(toRoot, mesh.matrixWorld);
    const sampler = new MeshSurfaceSampler(mesh).build();
    const map = (mesh.material as THREE.MeshStandardMaterial).map;
    const px = map?.image ? readPixels(map.image) : null;
    const end = Math.min(totalParticles, (mi + 1) * per);
    let guard = 0;

    while (n < end && guard++ < per * 40) {
      sampler.sample(pos, undefined, undefined, uv);
      let l = 0.1;
      if (px) {
        const x = Math.min(px.w - 1, Math.max(0, Math.floor(uv.x * px.w)));
        // glTF textures use flipY = false (v measured from the top row)
        const v = map?.flipY === false ? uv.y : 1 - uv.y;
        const y = Math.min(px.h - 1, Math.max(0, Math.floor(v * px.h)));
        const idx = (y * px.w + x) * 4;
        l = (px.data[idx] + px.data[idx + 1] + px.data[idx + 2]) / 765;
      }
      if (l <= 0.5 && Math.random() > 1 / 6) continue; // 6x weight for ink
      pos.applyMatrix4(rel);
      const k = n * 3;
      shapePositions[k] = pos.x;
      shapePositions[k + 1] = pos.y;
      shapePositions[k + 2] = pos.z;
      const q = l > 0.5 ? 1 : Math.min(1, 0.22 + l * 2.4) * 0.8;
      shapeColors[k] = q;
      shapeColors[k + 1] = q;
      shapeColors[k + 2] = q;
      n++;
    }
  });

  return {
    totalParticles,
    shapePositions,
    shapeColors,
    ...buildStarfield(totalParticles),
  };
}
