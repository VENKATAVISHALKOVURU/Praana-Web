import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

function Welcome() {
  const navigate = useNavigate();
  const illustrationRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (window.innerWidth > 768 && illustrationRef.current) {
        const moveX = (e.clientX - window.innerWidth / 2) / 100;
        const moveY = (e.clientY - window.innerHeight / 2) / 100;
        illustrationRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleBegin = () => {
    navigate('/signup');
  };

  return (
    <div className="welcome-container">
      {/* Onboarding Canvas */}
      <main className="welcome-main">
        {/* Top: Abstract Illustration Section */}
        <div className="illustration-section">
          <div className="illustration-wrapper" ref={illustrationRef}>
            <img 
              alt="Fragmented Attention Calming" 
              className="illustration-image" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMDijzTsUcOEBRhCrrmHp0bQwIumQl9QoDo556w-ho4MQ9QzRgs4D7lmTwTeiYTpO2sEkJR1tSG3jT4ohvMc9cZfaLinAT8H3R0Nv6u3Ug9B0UuIHyRRNLdsnBrjyKe3dG9RwjZstrT9tgQZnumhT0NyUCG1Djx1X2dnjAs_dU-lvpVb6UrHeZI8QAMn75KToarwqmapY2Yu9js2l-5R2jNplhFiJvK_pZiQLb26snn4uFVsQIdmb-IFOYHHn4IfL7BxvdNdtDg7M"
            />
            {/* Soft overlay for "Conscious Layer" feel */}
            <div className="illustration-overlay"></div>
          </div>
          
          {/* Branding Accent */}
          <div className="branding-accent">
            <span className="material-symbols-outlined logo-icon-small">bubble_chart</span>
            <span className="branding-text">Praana</span>
          </div>
        </div>

        {/* Center: Editorial Content */}
        <div className="editorial-content">
          <h1 className="editorial-title">
            Your attention deserves awareness.
          </h1>
          <p className="editorial-description">
            Praana helps you notice unconscious digital habits before they consume your focus.
          </p>
        </div>

        {/* Bottom: Action & Footnote */}
        <div className="action-section">
          <button className="btn-primary" onClick={handleBegin}>
            Begin
          </button>
          <div className="footnote">
            <p className="footnote-text">
              No pressure. Just awareness.
            </p>
            <div className="footnote-divider"></div>
          </div>
        </div>
      </main>

      {/* Decorative Corner Elements (Subtle Minimalism) */}
      <div className="decorative-corner top-right">
        <div className="corner-border-tr"></div>
      </div>
      <div className="decorative-corner bottom-left">
        <div className="corner-border-bl"></div>
      </div>
    </div>
  );
}

export default Welcome;
