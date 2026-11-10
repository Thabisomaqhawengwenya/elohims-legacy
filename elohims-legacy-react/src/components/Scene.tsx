import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import frontImgUrl from '../assets/front.webp';
import backImgUrl from '../assets/back.webp';
import {
  buildParticleBuffers,
  buildParticleBuffersFromMesh,
  loadBlenderParticles,
  loadImage,
  ParticleBuffers,
} from '../three/ParticleSystem';
import { interpolateKeyframes } from '../three/keyframes';
import {
  particleVertexShader,
  particleFragmentShader,
  backgroundVertexShader,
  backgroundFragmentShader,
} from '../three/shaders';

/** Blender-modelled tee (front + back prints, looping cloth ripple), meshopt-compressed. */
export const TEE_MODEL_URL = `${import.meta.env.BASE_URL}models/elohim-tee.glb`;
/** Particle system authored in Blender Geometry Nodes (garment points, nebula, swirl). */
export const TEE_PARTICLES_URL = `${import.meta.env.BASE_URL}models/tee-particles.bin`;
/**
 * Fit of the sewn tee to the original photo shirt's on-screen footprint (547px tall,
 * centred at y=449 on a 1440x900 viewport), calibrated from live canvas measurements
 * averaged over the idle bob so collar-to-hem matches the original.
 */
const TEE_SCALE = 1.094;
const TEE_OFFSET_Y = 0.11;

interface SceneProps {
  onLoaded?: () => void;
  isLight?: boolean;
}

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export const Scene: React.FC<SceneProps> = ({ onLoaded, isLight = false }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isLightRef = useRef<boolean>(isLight);
  // Held in a ref so a new callback identity from the parent never rebuilds the renderer
  const onLoadedRef = useRef(onLoaded);

  useEffect(() => {
    isLightRef.current = isLight;
  }, [isLight]);

  useEffect(() => {
    onLoadedRef.current = onLoaded;
  }, [onLoaded]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 800;
    const lowEnd = (navigator.hardwareConcurrency || 8) <= 4;
    // The Blender particle file holds 30k pre-shuffled points; phones take an even prefix
    const totalParticles = Math.round((isMobile ? 16000 : 30000) * (lowEnd ? 0.6 : 1));
    const BG_COUNT = 1500;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance',
    });
    // 1.5x is visually identical for soft particles but cuts fill-rate ~44% vs 2x
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const canvas = renderer.domElement;
    canvas.id = 'gl';
    Object.assign(canvas.style, {
      position: 'fixed',
      inset: '0',
      width: '100%',
      height: '100%',
      display: 'block',
      zIndex: '0',
      pointerEvents: 'none',
    });
    container.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 11;

    // Studio lighting for the cotton tee: soft key, cool rim to separate black fabric from the dark page
    scene.add(new THREE.HemisphereLight(0xffffff, 0x1a1a22, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(-4, 5, 7);
    const rim = new THREE.DirectionalLight(0xdfe6ff, 2.2);
    rim.position.set(6, 3, -6);
    const fill = new THREE.DirectionalLight(0xfff4e6, 0.8);
    fill.position.set(6, -2, 5);
    scene.add(key, rim, fill);

    // Everything that follows the scroll choreography lives in one group
    const group = new THREE.Group();
    scene.add(group);

    const uniforms = {
      uPR: { value: renderer.getPixelRatio() },
      uMouse: { value: new THREE.Vector2(999, 999) },
      uTime: { value: 0 },
      uScatter: { value: 1 },
      uMotion: { value: 1 },
      uLight: { value: 0 },
      uAlpha: { value: 1 },
    };
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms,
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
    });
    const geometry = new THREE.BufferGeometry();
    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    points.visible = false;
    group.add(points);

    const bgUniforms = {
      uTime: uniforms.uTime,
      uMotion: uniforms.uMotion,
      uSize: { value: 0.06 },
      uScale: { value: window.innerHeight * renderer.getPixelRatio() * 0.5 },
      uColor: { value: new THREE.Color(0xffffff) },
      uOpacity: { value: 0.7 },
    };
    const bgMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: bgUniforms,
      vertexShader: backgroundVertexShader,
      fragmentShader: backgroundFragmentShader,
    });
    const bgGeometry = new THREE.BufferGeometry();
    const bgPoints = new THREE.Points(bgGeometry, bgMaterial);
    bgPoints.frustumCulled = false;
    bgPoints.visible = false;
    scene.add(bgPoints);

    let isReady = false;
    let isMounted = true;
    let tee: THREE.Object3D | null = null;
    let teeMaterials: THREE.Material[] = [];
    let mixer: THREE.AnimationMixer | null = null;

    /** Upload all particle data once; the shaders animate it from here on. */
    const applyBuffers = (b: ParticleBuffers, shapeScale = 1) => {
      const n = b.totalParticles;
      if (shapeScale !== 1) {
        // garment-space points follow the tee's display scale and offset
        for (let k = 0; k < n * 3; k++) {
          const dy = k % 3 === 1 ? TEE_OFFSET_Y : 0;
          b.shapePositions[k] = b.shapePositions[k] * shapeScale + dy;
          if (b.midPositions) b.midPositions[k] = b.midPositions[k] * shapeScale + dy;
        }
      }
      const phase = new Float32Array(n);
      const star = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        phase[i] = i * 0.15;
        star[i] = ((i * 37) % 10) / 10;
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(b.starPositions, 3));
      geometry.setAttribute('aShape', new THREE.BufferAttribute(b.shapePositions, 3));
      let mid = b.midPositions;
      if (!mid) {
        // no designed swirl: control point halfway = straight-line morph
        mid = new Float32Array(n * 3);
        for (let k = 0; k < n * 3; k++) mid[k] = (b.shapePositions[k] + b.starPositions[k]) * 0.5;
      }
      geometry.setAttribute('aMid', new THREE.BufferAttribute(mid, 3));
      geometry.setAttribute('aColor', new THREE.BufferAttribute(b.shapeColors, 3));
      geometry.setAttribute('aSpeed', new THREE.BufferAttribute(b.starSpeeds, 1));
      geometry.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
      geometry.setAttribute('aStar', new THREE.BufferAttribute(star, 1));
      geometry.setAttribute('size', new THREE.BufferAttribute(b.initialSizes, 1));

      const bgSpeed = new Float32Array(BG_COUNT);
      const bgPhase = new Float32Array(BG_COUNT);
      for (let i = 0; i < BG_COUNT; i++) {
        bgSpeed[i] = 0.75 + ((i * 19) % 10) * 0.08;
        bgPhase[i] = i;
      }
      bgGeometry.setAttribute('position', new THREE.BufferAttribute(b.backgroundPositions, 3));
      bgGeometry.setAttribute('aSpeed', new THREE.BufferAttribute(bgSpeed, 1));
      bgGeometry.setAttribute('aPhase', new THREE.BufferAttribute(bgPhase, 1));

      points.visible = true;
      bgPoints.visible = true;
      isReady = true;
    };

    // Fallback: original photo-sampled particles if the 3D model can't load
    const loadImageFallback = () =>
      Promise.all([loadImage(frontImgUrl), loadImage(backImgUrl)])
        .then(([f, b]) => {
          if (!isMounted) return;
          applyBuffers(buildParticleBuffers(f, b, totalParticles));
          onLoadedRef.current?.();
        })
        .catch((err) => console.error('Failed to load particle textures:', err));

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      TEE_MODEL_URL,
      (gltf) => {
        if (!isMounted) {
          gltf.scene.traverse((o) => {
            const m = o as THREE.Mesh;
            if (m.isMesh) {
              m.geometry.dispose();
              (m.material as THREE.Material).dispose();
            }
          });
          return;
        }
        const meshes: THREE.Mesh[] = [];
        const maxAniso = Math.min(4, renderer.capabilities.getMaxAnisotropy());
        gltf.scene.traverse((o) => {
          const m = o as THREE.Mesh;
          if (!m.isMesh) return;
          const mat = m.material as THREE.MeshStandardMaterial;
          if (/Front|Back/.test(mat.name)) meshes.push(m); // printed outer panels only
          // Dithered dissolve: fades without transparency sorting artefacts
          mat.alphaHash = true;
          if (mat.map) mat.map.anisotropy = maxAniso;
          mat.needsUpdate = true;
          teeMaterials.push(mat);
        });
        tee = gltf.scene;
        tee.scale.setScalar(TEE_SCALE);
        tee.position.y = TEE_OFFSET_Y;
        group.add(tee);
        const teeRoot = tee;

        if (gltf.animations.length) {
          mixer = new THREE.AnimationMixer(tee);
          gltf.animations.forEach((clip) => mixer!.clipAction(clip).play());
        }
        // The solid tee is enough to reveal the page; the Blender particle system
        // streams in afterwards so it never delays first paint.
        onLoadedRef.current?.();
        loadBlenderParticles(TEE_PARTICLES_URL, totalParticles)
          .then((b) => isMounted && applyBuffers(b, TEE_SCALE))
          .catch((err) => {
            console.warn('Blender particles unavailable, sampling the mesh instead:', err);
            if (isMounted)
              applyBuffers(buildParticleBuffersFromMesh(meshes, totalParticles, teeRoot), TEE_SCALE);
          });
      },
      undefined,
      (err) => {
        console.warn('3D tee model failed to load, using photo particles:', err);
        if (isMounted) loadImageFallback();
      }
    );

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      bgUniforms.uScale.value = window.innerHeight * renderer.getPixelRatio() * 0.5;
    };
    window.addEventListener('resize', onResize);

    let mx = 0;
    let my = 0;
    let cx = 0;
    let cy = 0;
    let px = 0;
    let moved = false;
    let U = 0;
    let last = 0;

    const fineQuery = window.matchMedia('(pointer: fine)');
    let isFine = fineQuery.matches;
    const onFineChange = (e: MediaQueryListEvent) => {
      isFine = e.matches;
    };
    fineQuery.addEventListener('change', onFineChange);

    const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isReduce = reduceQuery.matches;
    const onReduceChange = (e: MediaQueryListEvent) => {
      isReduce = e.matches;
    };
    reduceQuery.addEventListener('change', onReduceChange);

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      moved = true;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    let rafId = 0;
    const tick = (timestamp: number) => {
      const t = timestamp * 0.001;
      const dt = Math.min(0.1, last ? t - last : 0);
      last = t;
      const wide = window.innerWidth > 800;

      const targetU = window.scrollY / Math.max(1, window.innerHeight);
      U += (targetU - U) * (isReduce ? 1 : 0.07);

      const [sc0, xo, ry] = interpolateKeyframes(U);
      // The solid tee can show before the particle file has streamed in
      const sc = isReady || tee ? sc0 : 1;
      const light = isLightRef.current;

      uniforms.uTime.value = t;
      uniforms.uScatter.value = sc;
      uniforms.uMotion.value = isReduce ? 0 : 1;
      uniforms.uLight.value = light ? 1 : 0;
      bgUniforms.uColor.value.setHex(light ? 0x222630 : 0xffffff);
      bgUniforms.uOpacity.value = light ? 0.35 : 0.7;

      // Solid tee while formed, dissolving into particles as the constellation takes over
      if (tee) {
        const solid = 1 - smoothstep(0.02, 0.3, sc);
        tee.visible = solid > 0.001;
        teeMaterials.forEach((m) => (m.opacity = solid));
        uniforms.uAlpha.value = smoothstep(0.0, 0.25, sc);
        if (mixer && tee.visible && !isReduce) mixer.update(dt);
      }
      points.visible = isReady && uniforms.uAlpha.value > 0.001;

      px += (mx / window.innerWidth - 0.5 - px) * 0.05;

      group.position.x = xo * (wide ? 1 : 0.15) * (1 - sc);
      // Phones: 1.7 (was 2.2) drops the tee ~40px so the rib collar clears the promo banner
      group.position.y = (wide ? 0 : 1.7) + (isReduce ? 0 : Math.sin(t * 1.1) * 0.2 * (1 - sc));
      group.rotation.y = ry + px * 0.5;
      group.rotation.x = (my / window.innerHeight - 0.5) * 0.15;
      group.scale.setScalar(wide ? 1.15 : 0.7);

      cx += (mx - cx) * 0.2;
      cy += (my - cy) * 0.2;

      if (moved && isFine && !isReduce) {
        const h = Math.tan((25 * Math.PI) / 180) * 11;
        uniforms.uMouse.value.set(
          ((cx / window.innerWidth) * 2 - 1) * h * camera.aspect,
          -((cy / window.innerHeight) * 2 - 1) * h
        );
      }

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      isMounted = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      fineQuery.removeEventListener('change', onFineChange);
      reduceQuery.removeEventListener('change', onReduceChange);

      mixer?.stopAllAction();
      tee?.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) m.geometry.dispose();
      });
      teeMaterials.forEach((m) => {
        (m as THREE.MeshStandardMaterial).map?.dispose();
        m.dispose();
      });
      teeMaterials = [];
      geometry.dispose();
      material.dispose();
      bgGeometry.dispose();
      bgMaterial.dispose();
      renderer.dispose();

      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);

  return <div ref={containerRef} />;
};
