import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Splash.css';

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically navigate to welcome after 2.5 seconds
    const timer = setTimeout(() => {
      navigate('/welcome');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      {/* Ambient Organic Background Layers */}
      <div className="background-layers">
        {/* Layer 1: Soft Herbal Green Base */}
        <div className="layer herbal-base"></div>
        {/* Layer 2: Mint Cream Mist */}
        <div className="layer mint-mist"></div>
        {/* Layer 3: Subtle Sage Accents */}
        <div className="layer sage-accents"></div>
        {/* Texture Overlay */}
        <div className="grain-texture"></div>
      </div>

      {/* Top Spacer for Vertical Rhythm */}
      <div className="top-spacer"></div>

      {/* Center Logo & Branding */}
      <main className="main-content">
        <div className="logo-pulse-visual">
          <div className="pulsing-aura"></div>
          <div className="pulsing-border"></div>
          <div className="branding-container">
            <span 
              className="material-symbols-outlined logo-icon animate-breathe" 
              style={{ fontVariationSettings: "'wght' 200" }}
            >
              bubble_chart
            </span>
            <h1 className="logo-text">Praana</h1>
          </div>
        </div>
      </main>

      {/* Bottom Editorial Affirmation */}
      <footer className="footer">
        <div className="progress-indicator">
          <div className="progress-bar"></div>
        </div>
        <p className="footer-text">
          Awareness before impulse.
        </p>
      </footer>
    </div>
  );
}

export default Splash;
