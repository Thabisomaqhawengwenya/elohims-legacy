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
}

export const Scene: React.FC<SceneProps> = ({ onLoaded }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 800;
    const totalParticles = isMobile ? 20000 : 40000;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 11;

    // Active particle buffers
    const geometry = new THREE.BufferGeometry();
    const posBuffer = new Float32Array(totalParticles * 3);
    const colBuffer = new Float32Array(totalParticles * 3);
    const szBuffer = new Float32Array(totalParticles);

    for (let i = 0; i < totalParticles; i++) {
      szBuffer[i] = 0.5 + Math.random() * 0.4;
      const q = 0.5 + Math.random() * 0.4;
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
      color: 0xd9d2c2,
      transparent: true,
      opacity: 0.6,
    });
    const bgPoints = new THREE.Points(bgGeometry, bgMaterial);
    scene.add(bgPoints);

    let buffers: ParticleBuffers | null = null;
    let isReady = false;

    // Load & sample tee images
    Promise.all([loadImage(frontImgUrl), loadImage(backImgUrl)])
      .then(([frontImg, backImg]) => {
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
    onResize();

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

      if (buffers) {
        const { shapePositions, shapeColors, starPositions } = buffers;
        for (let k = 0; k < totalParticles * 3; k++) {
          posBuffer[k] = isReady
            ? shapePositions[k] * (1 - sc) + starPositions[k] * sc
            : starPositions[k];

          if (isReady) {
            colBuffer[k] =
              shapeColors[k] * (1 - sc) +
              (0.55 + 0.3 * (((k * 37) % 10) / 10)) * sc;
          }
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
      renderer.forceContextLoss();
    };
  }, [onLoaded]);

  return <canvas id="gl" ref={canvasRef} />;
};
