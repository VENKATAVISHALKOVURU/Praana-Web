const fs = require('fs');
const path = require('path');

const htmlContent = fs.readFileSync(path.join(__dirname, 'praana.html'), 'utf8');

// Extract CSS
const styleMatch = htmlContent.match(/<style>([\s\S]*?)<\/style>/);
if (styleMatch) {
  let css = styleMatch[1];
  // namespace or scope it so it doesn't bleed too much, though landing page might need global
  // I will just save it as is.
  fs.writeFileSync(path.join(__dirname, 'src', 'landing.css'), css.trim());
}

// Extract Body
const bodyMatch = htmlContent.match(/<body>([\s\S]*?)<\/body>/);
if (bodyMatch) {
  let bodyContent = bodyMatch[1];
  
  // Basic JSX Conversions
  bodyContent = bodyContent.replace(/class=/g, 'className=');
  bodyContent = bodyContent.replace(/stroke-width/g, 'strokeWidth');
  bodyContent = bodyContent.replace(/stroke-dasharray/g, 'strokeDasharray');
  bodyContent = bodyContent.replace(/stroke-dashoffset/g, 'strokeDashoffset');
  bodyContent = bodyContent.replace(/fill-rule/g, 'fillRule');
  bodyContent = bodyContent.replace(/clip-rule/g, 'clipRule');
  bodyContent = bodyContent.replace(/<!--[\s\S]*?-->/g, ''); // Remove comments
  
  // Replace inline styles with objects
  // This is tricky, a simple regex won't perfectly parse all styles, but let's do a basic one for common ones in this file
  bodyContent = bodyContent.replace(/style="([^"]*)"/g, (match, p1) => {
    const styleObj = {};
    p1.split(';').forEach(rule => {
      if (!rule.trim()) return;
      const [key, val] = rule.split(':');
      if (key && val) {
        const camelKey = key.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        styleObj[camelKey] = val.trim();
      }
    });
    return `style={${JSON.stringify(styleObj)}}`;
  });
  
  // Replace onclick with onClick
  bodyContent = bodyContent.replace(/onclick="([^"]*)"/g, 'onClick={() => {}}');
  
  // Self close inputs
  bodyContent = bodyContent.replace(/<input([^>]*?)>/g, (match) => {
    if (match.endsWith('/>')) return match;
    return match.replace(/>$/, ' />');
  });

  const jsxTemplate = `import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../landing.css';
import { Canvas } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, OrbitControls } from '@react-three/drei';

function AnimatedOrb() {
  return (
    <Canvas style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} />
      <Sphere visible args={[1, 100, 200]} scale={2.5}>
        <MeshDistortMaterial
          color="#c3e5b2"
          attach="material"
          distort={0.4}
          speed={1.5}
          roughness={0.2}
          transparent
          opacity={0.6}
        />
      </Sphere>
    </Canvas>
  );
}

export default function Landing() {
  const navigate = useNavigate();

  const handleEnterSpace = () => {
    navigate('/login');
  };

  const handleBeginJourney = () => {
    navigate('/signup');
  };

  return (
    <div className="landing-page-wrapper">
      ${bodyContent}
    </div>
  );
}
`;

  fs.writeFileSync(path.join(__dirname, 'src', 'components', 'Landing.jsx'), jsxTemplate);
}
