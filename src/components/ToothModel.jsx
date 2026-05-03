import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * 3D Realistic Tooth Model Component
 * Loads a professional GLB model from the University of Dundee
 * Includes floating + mouse-following animations
 */
export default function ToothModel() {
  const containerRef = useRef(null);
  const toothGroupRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const requestRef = useRef();

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // --- Load GLB Model ---
    const toothGroup = new THREE.Group();
    toothGroupRef.current = toothGroup;
    scene.add(toothGroup);

    const loader = new GLTFLoader();
    loader.load(
      '/models/tooth.glb',
      (gltf) => {
        const model = gltf.scene;
        
        // Scale and position the model
        model.scale.set(1.5, 1.5, 1.5);
        model.position.y = 0;
        
        // Enhance materials for better appearance
        model.traverse((node) => {
          if (node.isMesh) {
            // Improve material properties
            if (node.material) {
              node.material.metalness = 0.1;
              node.material.roughness = 0.3;
              node.material.envMapIntensity = 0.5;
            }
          }
        });
        
        toothGroup.add(model);
      },
      undefined,
      (error) => {
        console.error('Error loading tooth model:', error);
        // Fallback: create a simple tooth if model fails to load
        createFallbackTooth(toothGroup);
      }
    );

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    
    const keyLight = new THREE.DirectionalLight(0xffffff, 1);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);
    
    const fillLight = new THREE.DirectionalLight(0xd0e8ff, 0.4);
    fillLight.position.set(-5, 3, 4);
    scene.add(fillLight);
    
    const rimLight = new THREE.PointLight(0x0071e3, 0.6);
    rimLight.position.set(-4, 5, -4);
    scene.add(rimLight);

    // Mouse
    const onMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Animation
    let t = 0;
    const animate = () => {
      requestRef.current = requestAnimationFrame(animate);
      t += 0.012;

      if (toothGroupRef.current) {
        toothGroupRef.current.position.y = 0.15 + Math.sin(t) * 0.12;
        targetRotationRef.current.x += (mouseRef.current.y * 0.4 - targetRotationRef.current.x) * 0.05;
        targetRotationRef.current.y += (mouseRef.current.x * 0.6 - targetRotationRef.current.y) * 0.05;
        toothGroupRef.current.rotation.x = targetRotationRef.current.x;
        toothGroupRef.current.rotation.y = targetRotationRef.current.y + Math.sin(t * 0.4) * 0.08;
      }
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-96"
      style={{ background: 'radial-gradient(circle at center, rgba(0,113,227,0.12) 0%, transparent 70%)' }}
    />
  );
}

/**
 * Fallback function to create a simple tooth if GLB loading fails
 */
function createFallbackTooth(toothGroup) {
  const toothMat = new THREE.MeshPhongMaterial({
    color: 0xf8f6f0,
    shininess: 120,
    specular: new THREE.Color(0x888888),
  });

  // Crown profile
  const crownPts = [
    new THREE.Vector2(0.0, 1.0),
    new THREE.Vector2(0.22, 0.95),
    new THREE.Vector2(0.46, 0.78),
    new THREE.Vector2(0.55, 0.55),
    new THREE.Vector2(0.57, 0.30),
    new THREE.Vector2(0.54, 0.08),
    new THREE.Vector2(0.50, 0.0),
  ];
  const crownGeo = new THREE.LatheGeometry(crownPts, 36);
  toothGroup.add(new THREE.Mesh(crownGeo, toothMat));

  // Root profile
  const rootPts = [
    new THREE.Vector2(0.50, 0.0),
    new THREE.Vector2(0.44, -0.28),
    new THREE.Vector2(0.32, -0.62),
    new THREE.Vector2(0.18, -0.92),
    new THREE.Vector2(0.06, -1.18),
    new THREE.Vector2(0.0, -1.30),
  ];
  const rootGeo = new THREE.LatheGeometry(rootPts, 36);
  toothGroup.add(new THREE.Mesh(rootGeo, toothMat));

  // Enamel ridge
  const ridgeMat = new THREE.MeshPhongMaterial({ color: 0xdedad2, shininess: 50 });
  const ridgeGeo = new THREE.TorusGeometry(0.505, 0.025, 8, 36);
  const ridge = new THREE.Mesh(ridgeGeo, ridgeMat);
  ridge.position.y = 0.1;
  toothGroup.add(ridge);

  toothGroup.position.y = 0.15;
}
