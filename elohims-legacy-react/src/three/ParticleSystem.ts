export interface ParticleBuffers {
  totalParticles: number;
  shapePositions: Float32Array;
  shapeColors: Float32Array;
  starPositions: Float32Array;
  starSpeeds: Float32Array;
  initialSizes: Float32Array;
  backgroundPositions: Float32Array;
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
  const starPositions = new Float32Array(totalParticles * 3);
  const starSpeeds = new Float32Array(totalParticles);
  const initialSizes = new Float32Array(totalParticles);

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

  return {
    totalParticles,
    shapePositions,
    shapeColors,
    starPositions,
    starSpeeds,
    initialSizes,
    backgroundPositions,
  };
}
