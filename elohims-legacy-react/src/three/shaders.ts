/**
 * GPU-driven particle shaders.
 *
 * All per-particle motion (garment <-> constellation morph, leftward star drift with
 * seamless wrap, vertical shimmer, mouse gravity) runs here, so the CPU never touches
 * or re-uploads the 40k-point buffers after the first frame.
 */
export const particleVertexShader = /* glsl */ `
  attribute vec3 aShape;   // point on the garment surface
  attribute vec3 aMid;     // Blender-designed swirl control point
  attribute vec3 aColor;   // garment colour sampled from the print texture
  attribute float aSpeed;  // leftward drift speed of the star state
  attribute float aPhase;  // per-point shimmer phase
  attribute float aStar;   // per-point star brightness (0-1)
  attribute float size;

  uniform float uPR;
  uniform float uTime;
  uniform float uScatter;  // 0 = garment, 1 = constellation
  uniform float uMotion;   // 0 when prefers-reduced-motion
  uniform float uLight;    // 1 = light theme
  uniform float uAlpha;    // overall particle visibility
  uniform vec2 uMouse;

  varying vec3 vC;
  varying float vA;

  void main() {
    // Star state: drift left across a 48-unit span and wrap around
    float sx = mod(position.x - aSpeed * uTime * uMotion + 24.0, 48.0) - 24.0;
    float sy = position.y + sin(uTime * 0.8 + aPhase) * 0.12 * uMotion;
    vec3 star = vec3(sx, sy, position.z);

    // Quadratic Bezier: garment -> vortex -> constellation
    float s = uScatter;
    float is = 1.0 - s;
    vec3 p = is * is * aShape + 2.0 * is * s * aMid + s * s * star;

    float starVal = mix(0.85 + 0.15 * aStar, 0.18 + 0.12 * aStar, uLight);
    float garment = mix(aColor.r, aColor.r > 0.5 ? 0.72 : 0.18, uLight);
    vC = vec3(mix(garment, starVal, uScatter));
    vec4 w = modelMatrix * vec4(p, 1.0);
    vec2 dd = w.xy - uMouse;
    float f = smoothstep(1.4, 0.0, length(dd));
    w.xy += normalize(dd + vec2(0.0001)) * f * 0.35;
    w.z += f * 0.15;
    vec4 m = viewMatrix * w;
    // Stars drifting right up to the lens fade out instead of ballooning into blobs
    vA = uAlpha * smoothstep(1.2, 4.0, -m.z);
    gl_PointSize = min(size * uPR * (70.0 / -m.z), 6.0 * uPR);
    gl_Position = projectionMatrix * m;
  }
`;

export const particleFragmentShader = /* glsl */ `
  varying vec3 vC;
  varying float vA;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(vC, smoothstep(0.5, 0.3, d) * vA);
  }
`;

/** Ambient background stars: drift and shimmer computed on the GPU. */
export const backgroundVertexShader = /* glsl */ `
  attribute float aSpeed;
  attribute float aPhase;
  uniform float uTime;
  uniform float uMotion;
  uniform float uSize;
  uniform float uScale;

  void main() {
    float x = mod(position.x - aSpeed * uTime * uMotion + 35.0, 70.0) - 35.0;
    float y = position.y + sin(uTime * 0.5 + aPhase) * 0.08 * uMotion;
    vec4 m = modelViewMatrix * vec4(x, y, position.z, 1.0);
    gl_PointSize = uSize * (uScale / -m.z);
    gl_Position = projectionMatrix * m;
  }
`;

export const backgroundFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;

  void main() {
    gl_FragColor = vec4(uColor, uOpacity);
  }
`;
