export const particleVertexShader = `
  attribute vec3 aColor;
  attribute float size;
  uniform float uPR;
  uniform vec2 uMouse;
  varying vec3 vC;

  void main() {
    vC = aColor;
    vec4 w = modelMatrix * vec4(position, 1.0);
    vec2 dd = w.xy - uMouse;
    float f = smoothstep(1.4, 0.0, length(dd));
    w.xy += normalize(dd + vec2(0.0001)) * f * 0.35;
    w.z += f * 0.15;
    vec4 m = viewMatrix * w;
    gl_PointSize = size * uPR * (70.0 / -m.z);
    gl_Position = projectionMatrix * m;
  }
`;

export const particleFragmentShader = `
  varying vec3 vC;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(vC, smoothstep(0.5, 0.3, d));
  }
`;
