'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function VantaFogBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Fog particles
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const speeds: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
      sizes[i] = Math.random() * 8 + 2;
      speeds.push(Math.random() * 0.02 + 0.005);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Create shader material for soft fog-like particles
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color('#021e49') },
        uColor2: { value: new THREE.Color('#12491c') },
        uColor3: { value: new THREE.Color('#0a0a2e') },
      },
      vertexShader: /* glsl */ `
        attribute float size;
        varying vec3 vPosition;
        varying float vSize;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (200.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
          vPosition = position;
          vSize = size;
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vPosition;
        varying float vSize;
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          float alpha = smoothstep(1.0, 0.0, d) * 0.15;
          float mixFactor = sin(vPosition.x * 0.1 + uTime) * 0.5 + 0.5;
          vec3 color = mix(uColor1, uColor2, mixFactor);
          color = mix(color, uColor3, sin(vPosition.y * 0.08 + uTime * 0.7) * 0.5 + 0.5);
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Fog layer planes for depth
    const createFogPlane = (y: number, opacity: number, scale: number) => {
      const planeGeo = new THREE.PlaneGeometry(100, 30);
      const planeMat = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uOpacity: { value: opacity },
          uColor: { value: new THREE.Color('#050510') },
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          varying vec2 vUv;
          uniform float uTime;
          uniform float uOpacity;
          uniform vec3 uColor;
          float noise(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
          }
          void main() {
            float n = noise(vUv * 10.0 + uTime * 0.02);
            float alpha = smoothstep(0.3, 0.7, n) * uOpacity;
            gl_FragColor = vec4(uColor, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
      });
      const plane = new THREE.Mesh(planeGeo, planeMat);
      plane.position.y = y;
      plane.scale.set(scale, scale, 1);
      return plane;
    };

    const fogPlanes = [
      createFogPlane(-8, 0.08, 1.5),
      createFogPlane(8, 0.06, 1.8),
      createFogPlane(0, 0.1, 2.0),
    ];
    fogPlanes.forEach(p => scene.add(p));

    // Mouse tracking
    let mouseX = 0;
    let mouseY = 0;
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

    // Animation loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth mouse follow
      mouseX += (targetMouseX - mouseX) * 0.02;
      mouseY += (targetMouseY - mouseY) * 0.02;

      // Move particles
      const posArray = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3 + 1] += speeds[i];
        if (posArray[i * 3 + 1] > 25) posArray[i * 3 + 1] = -25;
        // Subtle horizontal drift
        posArray[i * 3] += Math.sin(elapsed * 0.3 + i) * 0.005;
      }
      geometry.attributes.position.needsUpdate = true;

      // Update uniforms
      material.uniforms.uTime.value = elapsed;
      fogPlanes.forEach(p => {
        (p.material as THREE.ShaderMaterial).uniforms.uTime.value = elapsed;
      });

      // Camera follows mouse subtly
      camera.position.x += (mouseX * 3 - camera.position.x) * 0.01;
      camera.position.y += (mouseY * 2 - camera.position.y) * 0.01;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      container.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      fogPlanes.forEach(p => {
        p.geometry.dispose();
        (p.material as THREE.ShaderMaterial).dispose();
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: '#050505' }}
    />
  );
}
