'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function VantaFogBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x050505, 1);
    container.appendChild(renderer.domElement);

    // Fog particle system
    const particleCount = 300;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.4,
      vertexColors: false,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.35,
      color: new THREE.Color('#021e49'),
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Second layer — brighter, larger particles
    const geo2 = new THREE.BufferGeometry();
    const pos2 = new Float32Array(150 * 3);
    for (let i = 0; i < 150; i++) {
      pos2[i * 3] = (Math.random() - 0.5) * 24;
      pos2[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos2[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    geo2.setAttribute('position', new THREE.BufferAttribute(pos2, 3));
    const mat2 = new THREE.PointsMaterial({
      size: 0.25,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.3,
      color: new THREE.Color('#12491c'),
    });
    const particles2 = new THREE.Points(geo2, mat2);
    scene.add(particles2);

    // Glow highlights
    const geo3 = new THREE.BufferGeometry();
    const pos3 = new Float32Array(60 * 3);
    for (let i = 0; i < 60; i++) {
      pos3[i * 3] = (Math.random() - 0.5) * 18;
      pos3[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos3[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    geo3.setAttribute('position', new THREE.BufferAttribute(pos3, 3));
    const mat3 = new THREE.PointsMaterial({
      size: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.2,
      color: new THREE.Color('#00d4ff'),
    });
    const highlights = new THREE.Points(geo3, mat3);
    scene.add(highlights);

    // Mouse tracking
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime() * 0.3;

      // Layer 1 — float upward with slow drift
      const p1 = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        p1[i * 3 + 1] += 0.003;
        if (p1[i * 3 + 1] > 7) p1[i * 3 + 1] = -7;
        p1[i * 3] += Math.sin(elapsed + i * 0.1) * 0.001;
      }
      geometry.attributes.position.needsUpdate = true;

      // Layer 2 — opposite drift
      const p2 = geo2.attributes.position.array as Float32Array;
      for (let i = 0; i < 150; i++) {
        p2[i * 3 + 1] += 0.002;
        if (p2[i * 3 + 1] > 8) p2[i * 3 + 1] = -8;
        p2[i * 3] += Math.cos(elapsed + i * 0.15) * 0.0015;
      }
      geo2.attributes.position.needsUpdate = true;

      // Highlights — pulse and drift
      const p3 = geo3.attributes.position.array as Float32Array;
      for (let i = 0; i < 60; i++) {
        p3[i * 3 + 1] += 0.004;
        if (p3[i * 3 + 1] > 5) p3[i * 3 + 1] = -5;
        p3[i * 3] += Math.sin(elapsed * 1.5 + i) * 0.002;
      }
      geo3.attributes.position.needsUpdate = true;
      mat3.opacity = 0.15 + Math.sin(elapsed * 0.5) * 0.08;

      // Mouse parallax
      camera.position.x += (targetMouseX * 1.5 - camera.position.x) * 0.02;
      camera.position.y += (targetMouseY * 1.0 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      geo2.dispose();
      mat2.dispose();
      geo3.dispose();
      mat3.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}

