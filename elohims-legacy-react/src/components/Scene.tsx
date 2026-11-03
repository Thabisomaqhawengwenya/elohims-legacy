import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import frontImgUrl from '../assets/front.webp';
import backImgUrl from '../assets/back.webp';
import {
  buildParticleBuffers,
  loadImage,
  ParticleBuffers,
} from '../three/ParticleSystem';
import { interpolateKeyframes } from '../three/keyframes';
import {
  particleVertexShader,
  particleFragmentShader,
} from '../three/shaders';

interface SceneProps {
  onLoaded?: () => void;
  isLight?: boolean;
}

export const Scene: React.FC<SceneProps> = ({ onLoaded, isLight = false }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isLightRef = useRef<boolean>(isLight);

  useEffect(() => {
    isLightRef.current = isLight;
  }, [isLight]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 800;
    const totalParticles = isMobile ? 20000 : 40000;

    // Renderer setup with dynamic canvas creation to support React 18 StrictMode cleanly
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight, false);

    const canvas = renderer.domElement;
    canvas.id = 'gl';
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';

    container.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 11;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Active particle buffers
    const geometry = new THREE.BufferGeometry();
    const posBuffer = new Float32Array(totalParticles * 3);
    const colBuffer = new Float32Array(totalParticles * 3);
    const szBuffer = new Float32Array(totalParticles);

    for (let i = 0; i < totalParticles; i++) {
      szBuffer[i] = 0.5 + Math.random() * 0.4;
      const q = isLightRef.current
        ? 0.18 + Math.random() * 0.12
        : 0.85 + Math.random() * 0.15;
      colBuffer[i * 3] = q;
      colBuffer[i * 3 + 1] = q;
      colBuffer[i * 3 + 2] = q;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(posBuffer, 3));
    geometry.setAttribute('aColor', new THREE.BufferAttribute(colBuffer, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(szBuffer, 1));

    const uniforms = {
      uPR: { value: renderer.getPixelRatio() },
      uMouse: { value: new THREE.Vector2(999, 999) },
    };

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms,
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Static background constellation
    const bgGeometry = new THREE.BufferGeometry();
    const bgMaterial = new THREE.PointsMaterial({
      size: 0.06,
      color: isLightRef.current ? 0x222630 : 0xffffff,
      transparent: true,
      opacity: isLightRef.current ? 0.35 : 0.7,
    });
    const bgPoints = new THREE.Points(bgGeometry, bgMaterial);
    scene.add(bgPoints);

    let buffers: ParticleBuffers | null = null;
    let isReady = false;
    let isMounted = true;

    // Load & sample tee images
    Promise.all([loadImage(frontImgUrl), loadImage(backImgUrl)])
      .then(([frontImg, backImg]) => {
        if (!isMounted) return;
        buffers = buildParticleBuffers(frontImg, backImg, totalParticles);
        bgGeometry.setAttribute(
          'position',
          new THREE.BufferAttribute(buffers.backgroundPositions, 3)
        );
        isReady = true;
        if (onLoaded) {
          onLoaded();
        }
      })
      .catch((err) => {
        console.error('Failed to load particle textures:', err);
      });

    // Handle viewport resize
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    // Mouse & Reduced Motion states
    let mx = 0;
    let my = 0;
    let cx = 0;
    let cy = 0;
    let px = 0;
    let moved = false;
    let U = 0;

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

    // Render loop
    let rafId: number;
    const tick = (timestamp: number) => {
      const t = timestamp * 0.001;
      const targetU = window.scrollY / Math.max(1, window.innerHeight);
      U += (targetU - U) * (isReduce ? 1 : 0.07);

      const [sc0, xo, ry] = interpolateKeyframes(U);
      const sc = isReady ? sc0 : 1;
      const light = isLightRef.current;

      bgMaterial.color.setHex(light ? 0x222630 : 0xffffff);
      bgMaterial.opacity = light ? 0.35 : 0.7;

      if (buffers) {
        const { shapePositions, shapeColors, starPositions, starSpeeds, backgroundPositions } = buffers;
        const span = 48;
        const halfSpan = span * 0.5;

        for (let i = 0; i < totalParticles; i++) {
          const k = i * 3;
          // Synchronized R=G=B creates stardust without pastel rainbow discoloration
          const starVal = light
            ? 0.18 + 0.12 * (((i * 37) % 10) / 10)
            : 0.85 + 0.15 * (((i * 37) % 10) / 10);

          // Autonomous continuous movement to the left after particles disperse
          const speed = isReduce ? 0 : starSpeeds[i];
          const rawStarX = starPositions[k] - speed * t;
          const starX = ((rawStarX + halfSpan) % span + span) % span - halfSpan;
          const starY = starPositions[k + 1] + (isReduce ? 0 : Math.sin(t * 0.8 + i * 0.15) * 0.12);
          const starZ = starPositions[k + 2];

          posBuffer[k] = isReady
            ? shapePositions[k] * (1 - sc) + starX * sc
            : starX;
          posBuffer[k + 1] = isReady
            ? shapePositions[k + 1] * (1 - sc) + starY * sc
            : starY;
          posBuffer[k + 2] = isReady
            ? shapePositions[k + 2] * (1 - sc) + starZ * sc
            : starZ;

          if (isReady) {
            const origC = shapeColors[k];
            const garmentC = light
              ? origC > 0.5
                ? 0.72
                : 0.18
              : origC;
            colBuffer[k] = garmentC * (1 - sc) + starVal * sc;
            colBuffer[k + 1] = garmentC * (1 - sc) + starVal * sc;
            colBuffer[k + 2] = garmentC * (1 - sc) + starVal * sc;
          } else {
            colBuffer[k] = starVal;
            colBuffer[k + 1] = starVal;
            colBuffer[k + 2] = starVal;
          }
        }

        // Ambient background stars gentle leftward parallax drift
        if (backgroundPositions && bgGeometry.attributes.position) {
          const bgArr = bgGeometry.attributes.position.array as Float32Array;
          const bgSpan = 70;
          const bgHalf = bgSpan * 0.5;
          for (let b = 0; b < 1500; b++) {
            const bk = b * 3;
            const bgSpeed = isReduce ? 0 : 0.75 + ((b * 19) % 10) * 0.08;
            const rawBgX = backgroundPositions[bk] - bgSpeed * t;
            bgArr[bk] = ((rawBgX + bgHalf) % bgSpan + bgSpan) % bgSpan - bgHalf;
            bgArr[bk + 1] = backgroundPositions[bk + 1] + (isReduce ? 0 : Math.sin(t * 0.5 + b) * 0.08);
          }
          bgGeometry.attributes.position.needsUpdate = true;
        }
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.aColor.needsUpdate = true;

      px += (mx / window.innerWidth - 0.5 - px) * 0.05;

      points.position.x =
        xo * (window.innerWidth > 800 ? 1 : 0.15) * (1 - sc);
      points.position.y =
        (window.innerWidth > 800 ? 0 : 2.2) +
        (isReduce ? 0 : Math.sin(t * 1.1) * 0.2 * (1 - sc));
      points.rotation.y = ry + px * 0.5;
      points.rotation.x = (my / window.innerHeight - 0.5) * 0.15;
      points.scale.setScalar(window.innerWidth > 800 ? 1.15 : 0.7);

      cx += (mx - cx) * 0.2;
      cy += (my - cy) * 0.2;

      if (moved && isFine && !isReduce) {
        const h = Math.tan((25 * Math.PI) / 180) * 11;
        material.uniforms.uMouse.value.set(
          ((cx / window.innerWidth) * 2 - 1) * h * camera.aspect,
          -((cy / window.innerHeight) * 2 - 1) * h
        );
      }

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    // Complete cleanup on unmount
    return () => {
      isMounted = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      fineQuery.removeEventListener('change', onFineChange);
      reduceQuery.removeEventListener('change', onReduceChange);

      geometry.dispose();
      material.dispose();
      bgGeometry.dispose();
      bgMaterial.dispose();
      renderer.dispose();

      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, [onLoaded]);

  return <div ref={containerRef} />;
};
