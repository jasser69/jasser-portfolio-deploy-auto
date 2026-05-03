import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function ToothModel() {
  const containerRef = useRef(null);
  const toothGroupRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const requestRef = useRef();
  const [status, setStatus] = useState('Inizializzazione...');

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    const toothGroup = new THREE.Group();
    toothGroupRef.current = toothGroup;
    scene.add(toothGroup);

    // Luci potenziate
    scene.add(new THREE.AmbientLight(0xffffff, 1.0));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(5, 10, 7);
    scene.add(keyLight);

    setStatus('Caricamento modello...');
    const loader = new GLTFLoader();
    
    // Proviamo sia il percorso assoluto che relativo
    const modelPath = '/models/tooth.glb';
    
    loader.load(
      modelPath,
      (gltf) => {
        setStatus('Modello caricato!');
        const model = gltf.scene;
        
        // Centra il modello
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        
        // Scala automatica basata sulla dimensione del box
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxDim;
        model.scale.set(scale, scale, scale);
        
        model.traverse((node) => {
          if (node.isMesh) {
            node.material.metalness = 0.2;
            node.material.roughness = 0.4;
          }
        });
        
        toothGroup.add(model);
      },
      (xhr) => {
        const percent = Math.round((xhr.loaded / xhr.total) * 100);
        setStatus(`Caricamento: ${percent}%`);
      },
      (error) => {
        console.error('Errore caricamento GLB:', error);
        setStatus('Errore caricamento. Uso fallback.');
        createFallbackTooth(toothGroup);
      }
    );

    const onMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    let t = 0;
    const animate = () => {
      requestRef.current = requestAnimationFrame(animate);
      t += 0.01;

      if (toothGroupRef.current) {
        toothGroupRef.current.position.y = Math.sin(t) * 0.15;
        targetRotationRef.current.x += (mouseRef.current.y * 0.5 - targetRotationRef.current.x) * 0.05;
        targetRotationRef.current.y += (mouseRef.current.x * 0.8 - targetRotationRef.current.y) * 0.05;
        toothGroupRef.current.rotation.x = targetRotationRef.current.x;
        toothGroupRef.current.rotation.y = targetRotationRef.current.y + t * 0.2;
      }
      renderer.render(scene, camera);
    };
    animate();

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
    <div className="relative w-full h-full min-h-96">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute bottom-4 left-4 text-xs text-blue-500 opacity-50 pointer-events-none">
        {status}
      </div>
    </div>
  );
}

function createFallbackTooth(toothGroup) {
  const geometry = new THREE.IcosahedronGeometry(1, 2);
  const material = new THREE.MeshPhongMaterial({ color: 0xf8f6f0, flatShading: true });
  const mesh = new THREE.Mesh(geometry, material);
  toothGroup.add(mesh);
}
